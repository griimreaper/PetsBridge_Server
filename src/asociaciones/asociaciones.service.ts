import { Inject, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Asociaciones } from './entity/asociaciones.entity';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { hash } from 'bcrypt';
import { Users } from 'src/users/entity/users.entity';
import { Animal } from 'src/animals/animals.entity';
import { RedSocial } from './entity/redSocial.entity';
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class AsociacionesService {
  constructor(
    @Inject('ASOCIACIONES_REPOSITORY')  // Inyectamos los providers de asociaciones
    private asociacionesProviders: typeof Asociaciones,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) { }

  async findAll(): Promise<Asociaciones[]> {  //funcion para retornar todas las asociaciones
    return this.asociacionesProviders.findAll({});
  }

  async findOne(id: string): Promise<Asociaciones> {
    try {
      const asociacion = await this.asociacionesProviders.findOne({
        where: { id },
        include: [
          {
            model: Animal,
            attributes: {
              exclude: ['as_id'],
            },
          },
          {
            model: RedSocial,
            attributes: {
              exclude: ['id', 'as_id'],
            },
          },
        ],
      });
  
      return asociacion;
    } catch (error) {
      console.error(error);
      throw new Error('Ocurrió un error al buscar la asociación.');
    }
  }

  async create(body: CreateAsociacionDto ): Promise<{ send: string; status: number }> { // funcion para crear asociacion
    const { email } = body;
    let { reds } = body;

    if (reds && typeof reds === 'string') reds = JSON.parse(reds); // condicional si el json existe y esta en formato string
  
    const transaction = await this.sequelize.transaction(); // transaccion iniciada para manejar errores al momento de crear

    try {
      if (await Users.findOne({ where: { email } }) || await Asociaciones.findOne({ where: { email } })) 
        return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST }; // el email ya esta en uso
      
      const asociacion = await this.asociacionesProviders.create({ ...body, isActive: true }, { transaction }); // se crea una asociacion
      if (Array.isArray(reds) && reds.length > 0) {                                          // se le envia la transaccion para crear la
        await Promise.all(                                                                   // tabla aninada RedSocial
          reds.map((red) =>
            RedSocial.create(  //se itera y se crear cada redsocial
              { as_id: asociacion.id, name: red.name, url: red.url },
              { transaction },
            ),
          ),
        );
      }

      await transaction.commit(); // transaccion exitosa
  
      return { send:'La asociacion se creo exitosamente.', status: HttpStatus.CREATED };
    } catch (error) {
      await transaction.rollback(); //transaccion erronea, no se crea el usuario

      throw new HttpException(error.message, 404);
    }
  }

  async delete(id: string): Promise<string> {
    let resultado = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0;i < 10; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indice);          // se genera un string aleatorio
    }

    try {
      const asociacion: Asociaciones = await this.asociacionesProviders.findOne({ where: { id } });

      if (asociacion) {
        asociacion.isActive = false;    // BORRADO LOGICO
        asociacion.email =  `_${asociacion.email}_${resultado}`;   //cambio de valor de email para que no hayan colisiones 
        await asociacion.save();                                   //al momento de volver a registrarse
        return 'Asociación eliminada correctamente';
      } else {
        throw new Error('No se encontró la asociación');
      }
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async update(
    id: string,
    { nameOfFoundation, country, description, password, address }: CreateAsociacionDto,
    img_profile?: any,
  ): Promise<string> {
    try {
      if (!nameOfFoundation && !country && !description && !password && !img_profile) {
        return 'Nada que actualizar';
      }
  
      const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
  
      if (asociacion) {
        if (nameOfFoundation) asociacion.nameOfFoundation = nameOfFoundation;
        if (country) asociacion.country = country;
        if (img_profile) asociacion.img_profile = img_profile;
        if (description) asociacion.description = description;
        if (address) asociacion.address = address;
        if (password) {
          const hashedPassword = await hash(password, 10);
          asociacion.password = hashedPassword;
        }
  
        await asociacion.save();
        return 'Datos actualizados';
      } else {
        throw new HttpException('La asociación no existe', 404);
      }
    } catch (error) {
      throw new HttpException('Error al actualizar la asociación', 404);
    }
  }
}