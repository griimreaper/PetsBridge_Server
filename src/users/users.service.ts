import { Inject, Injectable, HttpStatus, HttpException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';
import { hash, compare } from 'bcrypt';
import { Publications } from '../publications_users/entity/publications_users.entity';
import { Animal } from '../animals/animals.entity';
import { ChangeEmailDto, ChangePasswordDto } from './dto/changeLoginData';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private serviceUsers: typeof Users,
    private readonly configureService: ConfigService,
    private readonly mailsService: MailsService,
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

  async findAll(rol: string): Promise<Users[]> {
    try {
      if (rol === 'admin') return await this.serviceUsers.findAll();
      let allUsers = await this.serviceUsers.findAll({ where: { isActive: true } });
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
      defaults: { ...body, isActive: true, rol: body.rol },
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

  async update(
    id: string,
    body: CreateUserDto,
    admin: string,
    image?: any,
  ): Promise<string> {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      isGoogle,
      rol,
      isActive,
    } = body;
    try {
      if (
        !firstName &&
        !lastName &&
        !email &&
        !phone &&
        !password &&
        !image &&
        !country &&
        !isGoogle &&
        !rol
      )
        return 'Nada que actualizar';
      const user = await this.serviceUsers.findByPk(id);
      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) {
          const hashedPassword = await hash(password, 10);
          user.password = hashedPassword;
        }
        if (image) user.image = image;
        if (country) user.country = country;
        if (isGoogle) user.isGoogle = isGoogle;
        if (rol && admin === 'admin') user.rol = rol;
        await user.save();
        return 'Actualizado';
      } else {
        return 'No existe el Usuario';
      }
    } catch (error) {
      throw new HttpException('Error al editar el usuario', 404);
    }
  }

  async findByEmail(email:string):Promise<Users> {
    try {
      const user = await this.serviceUsers.findOne({ where:{ email } });
      return user;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async findByToken(token:string | string[]):Promise<Users> {
    try {
      const user = await this.serviceUsers.findOne({ where:{ reset:token } });
      return user;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async filtName(name: string, rol:string): Promise<Users | Users[]> {
    try {
      let usuarios = rol === 'admin' ?
        await this.serviceUsers.findAll()
        : await this.serviceUsers.findAll({ where: { isActive: true } });
      usuarios = usuarios.filter(u => {
        if (u.firstName && u.lastName) {
          const Name = u.firstName + ' ' + u.lastName;
          return Name.toLowerCase().includes(name.toLowerCase());
        }
        return false;
      });
      return usuarios;
    } catch (error) {
      throw new HttpException('Error to find a user.', 404);
    }
  }
  
  async changePassword(changePasswordto:ChangePasswordDto):Promise<{ affectedCounts:number[], message:string } | string> {
    try {
      
      if (changePasswordto.oldPassword === changePasswordto.newPassword) throw new BadRequestException('newPassword cannot be equal to oldPassword');
      const user = await this.serviceUsers.findByPk(changePasswordto.id);
      const areEqual = await compare(changePasswordto.oldPassword, user.password);

      if (!areEqual) throw new ForbiddenException('Incorrect password');
      const hashedPassword = await hash(changePasswordto.newPassword, 10);
      const counts = await this.serviceUsers.update({ password:hashedPassword }, {
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

  async changeEmail(body:ChangeEmailDto):Promise<any> {
    try {
      const { id, newEmail, password } = body;
      const user = await this.serviceUsers.findByPk(id);
      if (!user) throw new NotFoundException('No se encontró al usuario');

      const rightPassword = await compare(password, user.password);
      if (!rightPassword) throw new BadRequestException('Contraseña incorrecta');

      if (user.email === newEmail) throw new BadRequestException('El nuevo email no puede ser igual al anterior');
      user.newEmail = newEmail;
      user.save();

      //Sending verification mail
      const date = new Date();
      const code = await hash(`${date.getTime()}`, 10);

      this.mailsService.sendMails({ firstName:user.firstName, email:newEmail, id:user.id, code:code }, 'VERIFY_USER');

      return 'changeEmailStep1 completly successfully';

    } catch (error) {
      return { message:error.message, status:error.status };
    }
  }
}
