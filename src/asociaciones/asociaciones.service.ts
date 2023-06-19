import { Inject, Injectable, HttpStatus, HttpException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Asociaciones } from './entity/asociaciones.entity';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { hash, compare } from 'bcrypt';
import { Users } from '../users/entity/users.entity';
import { Animal } from '../animals/animals.entity';
import { RedSocial } from './entity/redSocial.entity';
import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';
import { IDataFake } from './interface/Iservice.interface';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { Op } from 'sequelize';
import { ChangeEmailDto, ChangePasswordDto } from './dto/changeLoginData.dto';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class AsociacionesService {
  constructor(
    @Inject('ASOCIACIONES_REPOSITORY') // Inyectamos los providers de asociaciones
    private asociacionesProviders: typeof Asociaciones,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    @Inject('ANIMALS_REPOSITORY')
    private readonly animalsProviders: typeof Animal,
    @Inject('ADOPTIONS_REPOSITORY')
    private readonly adoptionsProviders: typeof Adoption,
    private readonly mailsService: MailsService,
  ) {}

  async findAllToLogin(): Promise<Asociaciones[]> {
    //funcion para retornar todas las asociaciones
    const allAsociations = await this.asociacionesProviders.findAll();

    return allAsociations;
  }


  async findAll(rol: string): Promise<Asociaciones[]> {
    //funcion para retornar todas las asociaciones
    try {
      if (rol === 'admin') return await this.asociacionesProviders.findAll();
      let allAsociations = await this.asociacionesProviders.findAll({ where: { isActive: true } });
      allAsociations = allAsociations.map(a =>{
        const { password, ...attributes } = a.dataValues;
        return attributes;
      });
      return allAsociations;
    } catch (error) {
      throw new HttpException('Error al intentar buscar las asociaciones', 404);
    }
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
        attributes: {
          exclude: ['password'],
        },
      });

      return asociacion;
    } catch (error) {
      throw new Error('Ocurrió un error al buscar la asociación.');
    }
  }

  async create(
    body: CreateAsociacionDto,
  ): Promise<{ send: string; status: number, asociacion?:Asociaciones }> {
    // funcion para crear asociacion
    const { email } = body;
    let { reds } = body;

    if (reds && typeof reds === 'string') reds = JSON.parse(reds); // condicional si el json existe y esta en formato string

    const transaction = await this.sequelize.transaction(); // transaccion iniciada para manejar errores al momento de crear

    try {
      if (
        (await Users.findOne({ where: { email } })) ||
        (await Asociaciones.findOne({ where: { email } }))
      )
        return {
          send: 'El email ya esta en uso.',
          status: HttpStatus.BAD_REQUEST,
        }; // el email ya esta en uso

      const asociacion = await this.asociacionesProviders.create(
        { ...body, isActive: true },
        { transaction },
      ); // se crea una asociacion
      if (Array.isArray(reds) && reds.length > 0) {
        // se le envia la transaccion para crear la
        await Promise.all(
          // tabla aninada RedSocial
          reds.map((red) =>
            RedSocial.create(
              //se itera y se crear cada redsocial
              { as_id: asociacion.id, name: red.name, url: red.url },
              { transaction },
            ),
          ),
        );
      }

      await transaction.commit(); // transaccion exitosa

      return {
        send: 'La asociacion se creo exitosamente.',
        status: HttpStatus.CREATED,
        asociacion: asociacion,
      };
    } catch (error) {
      await transaction.rollback(); //transaccion erronea, no se crea el usuario

      throw new HttpException(error.message, 404);
    }
  }

  async delete(id: string): Promise<string> {
    let resultado = '';
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indice); // se genera un string aleatorio
    }

    try {
      const asociacion: Asociaciones = await this.asociacionesProviders.findOne(
        { where: { id } },
      );

      if (asociacion && asociacion.isActive) {
        asociacion.isActive = false; // BORRADO LOGICO
        asociacion.email = `_${asociacion.email}_${resultado}`; //cambio de valor de email para que no hayan colisiones
        await asociacion.save(); //al momento de volver a registrarse
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
    {
      nameOfFoundation,
      country,
      description,
      password,
      address,
    }: CreateAsociacionDto,
    profilePic?: any,
  ): Promise<string> {
    try {
      if (
        !nameOfFoundation &&
        !country &&
        !description &&
        !password &&
        !profilePic
      ) {
        return 'Nada que actualizar';
      }

      const asociacion = await this.asociacionesProviders.findOne({
        where: { id },
      });

      if (asociacion) {
        if (nameOfFoundation) asociacion.nameOfFoundation = nameOfFoundation;
        if (country) asociacion.country = country;
        if (profilePic) asociacion.image = profilePic;
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

  async generateData(): Promise<IDataFake[]> {
    const dataAso = [];
    for (let i = 0; i < 20; i++) {
      const asociacion: IDataFake = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        nameOfFoundation: faker.company.name(),
        image: faker.image.url(),
        dateStart: faker.date.past().toISOString().split('T')[0],
        description: faker.lorem.sentence(),
        phone: faker.phone.number(),
        country: faker.location.country(),
        address: faker.location.streetAddress(),
        isActive: true,
      };
      dataAso.push(asociacion);
    }
    this.asociacionesProviders.bulkCreate(dataAso);
    return dataAso;
  }

  async findByEmail(email:string):Promise<Asociaciones> {
    try {
      const asociacion = await this.asociacionesProviders.findOne({ where:{ email } });
      return asociacion;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async findByToken(token:string | string[]):Promise<Asociaciones> {
    try {
      const asociacion = await this.asociacionesProviders.findOne({ where:{ reset:token } });
      return asociacion;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async filtName(name: string, rol: string): Promise<Asociaciones | Asociaciones[]> {
    try {
      const fundation = rol === 'admin' ?
        await this.asociacionesProviders.findAll()
        : await this.asociacionesProviders.findAll({ where: { isActive: true } });
      return fundation.filter(a => a.nameOfFoundation.toLowerCase().includes(name.toLowerCase()));
    } catch (error) {
      throw new HttpException('Error to find a fundation.', 404);
    }
  }

  async getAdoptions(id: string): Promise<Adoption | Adoption[]> {
    try {
      const animal = await this.animalsProviders.findAll({
        where: {
          as_id: id,
          status: {
            [Op.not]: 'homeless',
          },
        },
      });
      const animalId: string[] = animal.map(a=> a.id);
      const adoptions = await this.adoptionsProviders.findAll({
        where: {
          animalID: {
            [Op.in]: animalId,
          },
        },
        include:[
          {
            model: Animal,
            attributes: {
              exclude: ['as_id', 'age_M', 'age_Y', 'registredAt'],
            },
          }, {
            model: Users,
            attributes: {
              exclude: ['password'],
            },
          },
        ],
      });
      return adoptions;
    } catch (error) {
      throw new HttpException('Error to show the adoptions.', 500);
    }
  }

  async changePassword(changePasswordto:ChangePasswordDto):Promise<{ affectedCounts:number[], message:string } | string> {
    try {
      
      if (changePasswordto.oldPassword === changePasswordto.newPassword) throw new BadRequestException('newPassword cannot be equal to oldPassword');
      const user = await this.asociacionesProviders.findByPk(changePasswordto.id);
      const areEqual = await compare(changePasswordto.oldPassword, user.password);

      if (!areEqual) throw new ForbiddenException('Incorrect password');
      const hashedPassword = await hash(changePasswordto.newPassword, 10);
      const counts = await this.asociacionesProviders.update({ password:hashedPassword }, {
        where:{ 
          id: changePasswordto.id, 
        },
      });
      if (!counts) throw new HttpException('Something went wrong', 500);
      return { affectedCounts: counts, message: 'Changed password successfully' };
    } catch (error) {
      return error;
    }   
  }

  async changeEmail(body:ChangeEmailDto):Promise<string | HttpException> {
    try {
      const { id, newEmail, password } = body;
      const asociacion = await this.asociacionesProviders.findByPk(id);
      if (!asociacion) throw new NotFoundException('No se encontró a la asociacion');
      if (await !compare(password, asociacion.password)) throw new BadRequestException('Contraseña incorrecta');
      asociacion.newEmail = newEmail;
      asociacion.save();

      //Sending verification mail
      const date = new Date();
      const code = await hash(`${date.getTime()}`, 10);

      this.mailsService.sendMails({ firstName:asociacion.nameOfFoundation, email:newEmail, id:asociacion.id, code:code }, 'VERIFY_USER');

      return 'changeEmailStep1 completly successfully';

    } catch (error) {
      return new HttpException(error.message, error.response.statusCode);
    }
  }
}
