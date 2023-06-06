import { Inject, Injectable, HttpStatus } from '@nestjs/common';
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

  async findOne(id: string): Promise<Asociaciones> { // funcion que retorna una asociacion
    return this.asociacionesProviders.findOne({
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
        },
      ],
    });
  }

  async create(body: CreateAsociacionDto ): Promise<{ send: string; status: number }> { // funcion para crear asociacion
    const { email, reds } = body;
    console.log(body);
    const transaction = await this.sequelize.transaction();
    try {
      if (await Users.findOne({ where: { email } }) 
      || await Asociaciones.findOne({ where: { email } })) 
        return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST }; // el email ya esta en uso
      
      const asociacion = await this.asociacionesProviders.create({ ...body }, { transaction }); //
      console.log(asociacion);
      if (Array.isArray(reds) && reds.length > 0) {
        console.log(reds);
        await Promise.all(
          reds.map((red) =>
            RedSocial.create(
              { as_Id: asociacion.id, name: red.name, url: red.url },
              { transaction },
            ),
          ),
        );
      }

      await transaction.commit();
  
      return { send:'La asociacion se creo exitosamente.', status: HttpStatus.CREATED };
    } catch (error) {
      await transaction.rollback();

      throw new Error(`Error al crear la asociación: ${error}`);
    }
  }

  async delete(id: string): Promise<string> { // funcion de borrado logico de asociaciones
    const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
    if (asociacion) {
      asociacion.status = false;
    }
    await asociacion.save();
    return 'Asociacion eliminada correctamente';
  }

  async update(id: string, { name, country, description, password, address }: CreateAsociacionDto, img_profile?: any): Promise<string> {
    if (!name && !country && !description && !password && !img_profile) return 'Nada que actualizar';
    const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
    if (asociacion) {
      if (name) asociacion.name = name;
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
      return 'La asociacion no existe';
    }
  }
}