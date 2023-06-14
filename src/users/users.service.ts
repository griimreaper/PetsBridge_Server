import { Inject, Injectable, HttpStatus, HttpException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';
import { hash, compare } from 'bcrypt';
import { Publications } from '../publications_users/entity/publications_users.entity';
import { Animal } from '../animals/animals.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private serviceUsers: typeof Users,
    private readonly configureService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async findAllToLogin(): Promise<Users[]> {
    try {
      const api = this.configureService.get('DB_HOST');
      const allUsers = await this.serviceUsers.findAll(api);
      return allUsers;
    } catch (error) {
      throw new HttpException('Error al intentar buscar los usuarios', 404);
    }
  }

  async findAll(): Promise<Users[]> {
    try {
      const api = this.configureService.get('DB_HOST');
      let allUsers = await this.serviceUsers.findAll(api);
      allUsers = allUsers.map(u => {
        const { password, ...attributes } = u.dataValues;
        return attributes;
      });
      return allUsers;
    } catch (error) {
      throw new HttpException('Error al intentar buscar los usuarios', 404);
    }
  }

  async createUser(
    body: CreateUserDto,
  ): Promise<{ send: string; status: number, user?:Users }> {
    // funcion para crear usuario
    const { email } = body;
    //verificamos que ese email no exista en la tabla asociaciones
    if (await Asociaciones.findOne({ where: { email } }))
      return {
        send: 'El email ya esta en uso.',
        status: HttpStatus.BAD_REQUEST,
      };
    //findOrCreate para que no se duplique el email
    const [users, created] = await this.serviceUsers.findOrCreate({
      where: { email },
      defaults: { ...body, isActive: true },
    });
    //condicion por si se encontro un email en uso
    if (!created)
      return {
        send: 'El email ya esta en uso.',
        status: HttpStatus.BAD_REQUEST,
      };
    //status 201
    return {
      send: 'El usuario se creo exitosamente.',
      status: HttpStatus.CREATED,
      user:users,
    };
  }

  async findById(id: string): Promise<Users> {
    try {
      const user = await this.serviceUsers.findByPk(id, {
        include: [
          {
            model: Publications,
            attributes: {
              exclude: ['userId'],
            },
          },
        ],
        attributes: {
          exclude: ['password'],
        },
      });

      if (!user) {
        throw new Error('No hay con ese id');
      }

      return user;
    } catch (error) {
      throw new HttpException('No se encontro el usuario.', 404);
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
      const user = await this.serviceUsers.findByPk(id);

      if (user) {
        user.isActive = false;
        user.email = `_${user.email}_${resultado}`;
        await user.save();
        return 'Usuario eliminado correctamente.';
      } else {
        throw new Error(`El usuarios con el ID '${id}' no se encuentra`);
      }
    } catch (error) {
      throw new HttpException('Error al eliminar el usuario', 404);
    }
  }

  async update(id: string, body, profilePic?: Express.Multer.File): Promise<string> {
    try {
      if (!body && !profilePic) throw new BadRequestException('Nada que actualizar');

      const urls = await this.fileService.createFiles(profilePic);

      const user = await this.serviceUsers.update({ ...body, image:urls }, {
        where:{ id },
      });
      if (user) throw new HttpException('Error al editar el usuario', 400);

      return 'Updated successfully';

    } catch (error) {
      return error;
    }
  }

  async changePassword(id:string, oldPassword:string, newPassword:string):Promise<{ affectedCounts:number[], message:string } | string> {
    try {
      if (oldPassword === newPassword) throw new BadRequestException('newPassword cannot be equal to oldPassword');
      const user = await this.serviceUsers.findByPk(id);
      const areEqual = await compare(oldPassword, user.password);

      if (!areEqual) throw new ForbiddenException('Incorrect password');
      const hashedPassword = await hash(newPassword, 10);
      const counts = await this.serviceUsers.update({ password:hashedPassword }, {
        where:{ id },
      });
      if (!counts) throw new HttpException('Something went wrong', 500);
      return { affectedCounts: counts, message: 'Changed password successfully' };
    } catch (error) {
      return error;
    }   
  }

  async findByEmail(email:string):Promise<Users> {
    try {
      const user = await this.serviceUsers.findOne({ where:{ email } });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findByToken(token:string | string[]):Promise<Users> {
    try {
      const user = await this.serviceUsers.findOne({ where:{ reset:token } });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
