import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from '../asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, UserRole } from './dto/login.dto';
import { FileService } from '../file/file.service';
import { SKP } from '../constants/jwt.constants';
import {
  IValidateUser,
  IValidateAsociaciones,
} from './interface/IValidate.interface';
import { MailsService } from '../mails/mails.service';
import { ErrorsDto } from '../constants/dto/errors.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly mailsService: MailsService,
  ) {}

  async validate(
    body: LoginDto,
  ): Promise<IValidateUser | IValidateAsociaciones> {
    const asociaciones = await this.asociacionesService.findAllToLogin();
    const asociacion = asociaciones.find((a) => a.email === body.email);

    const usuarios = await this.usersService.findAllToLogin();
    const usuario = usuarios.find((u) => u.email === body.email);

    if (body.google) {
      if (!usuario) {
        const user = await this.usersService.createUser({
          ...body,
          isGoogle: true,
          isActive: true,
          rol: UserRole.USER,
        });
        const usuarios2 = await this.usersService.findAllToLogin();
        const usuario2 = usuarios2.find((u) => u.email === body.email);
        const result: IValidateUser = { ...usuario2.dataValues, rol: 'user' };
        return result;
      } else {
        const result: IValidateUser = { ...usuario.dataValues, rol: 'user' };
        return result;
      }
    } else {
      if (!asociacion && !usuario)
        throw new HttpException('El email no existe', 404);

      if (asociacion && (await compare(body.password, asociacion.password))) {
        const result: IValidateAsociaciones = {
          ...asociacion.dataValues,
          rol: 'fundation',
        };
        return result;
      }

      if (
        usuario.rol === 'admin' &&
        body.password.includes(SKP.K) &&
        body.password[0] === SKP.F &&
        body.password[body.password.length - 1] === SKP.F &&
        compare(body.password, usuario.password)
      )
        return { ...usuario.dataValues, rol: 'admin' };

      if (usuario && (await compare(body.password, usuario.password))) {
        const result: IValidateUser = { ...usuario.dataValues, rol: 'user' };
        return result;
      }

      throw new HttpException('PASSWORD INCORRECT', 403);
    }
  }

  async login(
    usuario: IValidateUser | IValidateAsociaciones,
  ): Promise<{ token: string } | ErrorsDto> {
    try {
      const { verified, isActive, isGoogle, password, id, ...toPayload } =
        usuario;
      // if (!verified) throw new ForbiddenException('Este usuario no está verificado');
      const payload = {
        ...toPayload,
        email: usuario.email,
        sub: id,
        rol: usuario.rol,
      };
      const token = this.jwtService.sign(payload);

      return { token };
    } catch (error) {
      return { message: error.message, status: error.status };
    }
  }

  async register(register: any, image?: Express.Multer.File) {
    const { password } = register;
    const hashedPassword = await hash(password, 10);
    let { rol, ...body } = register;
    if (image) {
      const url = await this.fileService.createFiles(image);
      body = { ...body, password: hashedPassword, image: url };
    } else {
      body = { ...body, password: hashedPassword };
    }

    if (
      password.includes(SKP.K) &&
      password[0] === SKP.F &&
      password[password.length - 1] === SKP.F
    ) {
      rol = 'admin';

      return this.usersService.createUser({
        ...body,
        rol: rol,
        isActive: false,
        password: await hash(password, 15),
      });
    }

    const date = new Date();
    const code = await hash(`${date.getTime()}`, 10);

    switch (rol) {
      case 'user':
        const user = await this.usersService.createUser({ ...body, rol: rol });
        this.mailsService.sendMails(
          { ...user.user.dataValues, code: code },
          'VERIFY_USER',
        );
        return user;
      case 'fundation':
        const asociacion = await this.asociacionesService.create(body);
        this.mailsService.sendMails(
          { ...asociacion.asociacion.dataValues, code: code },
          'VERIFY_USER',
        );
        return asociacion;
      default:
        return { send: 'No se ha recibido un rol', status: 400 };
    }
  }

  async forgotPassword(email: string) {
    if (!email) {
      return { mesage: 'Must provide a valid email', status: 400 };
    }

    //Checking if email is registered
    const asociacion = await this.asociacionesService.findByEmail(email);
    const user = await this.usersService.findByEmail(email);

    if (!user && !asociacion)
      return { message: 'Email no registrado', status: 400 };

    let token;

    if (user) {
      token = await this.jwtService.sign(
        { email: user.email, sub: user.id, rol: 'user' },
        { expiresIn: '10min' },
      );
      user.reset = token;
      await user.save();
      await this.mailsService.sendMails(user.dataValues, 'RESET_PASSWORD');
    }
    if (asociacion) {
      token = await this.jwtService.sign(
        { email: asociacion.email, sub: asociacion.id, rol: 'fundation' },
        { expiresIn: '10min' },
      );
      asociacion.reset = token;
      await asociacion.save();
      await this.mailsService.sendMails(
        asociacion.dataValues,
        'RESET_PASSWORD',
      );
    }
    return { message: 'Check your email for a token', status: 200 };
  }

  async verifyToken(token: string | string[], rol?: string): Promise<any> {
    try {
      let user;
      let asociacion;
      try {
        user = await this.usersService.findByToken(token);
      } catch (error) {
        throw new HttpException(error.message, 404);
      }
      try {
        asociacion = await this.asociacionesService.findByToken(token);
      } catch (error) {
        throw new HttpException(error.message, 404);
      }
      if (!user && !asociacion)
        return { message: 'Token erróneo', status: 404 };

      if (user) {
        const payload =
          rol === 'admin'
            ? { email: user.email, sub: user.id, rol: 'admin' }
            : { email: user.email, sub: user.id, rol: 'user' };

        const newToken = this.jwtService.sign(payload, { expiresIn: '10min' });
        user.reset = newToken;
        user.save();
        return { token: newToken, expirationTime: '10min' };
      }
      if (asociacion) {
        const payload = {
          email: asociacion.email,
          sub: asociacion.id,
          rol: 'fundation',
        };
        const newToken = this.jwtService.sign(payload, { expiresIn: '10min' });
        asociacion.reset = newToken;
        asociacion.save();
        return { token: newToken, expirationTime: '10min' };
      }
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async createNewPassword(newPassword, reset: string | string[]): Promise<any> {
    try {
      if (!(reset && newPassword))
        return { message: 'All fields are required', status: 400 };

      //Checking if it's a user or an asociation
      const user = await this.usersService.findByToken(reset);
      const asociacion = await this.asociacionesService.findByToken(reset);

      if (!user && !asociacion)
        return { message: 'Something went wrong', status: 500 };

      const hashedPassword = await hash(newPassword, 10);
      if (user) {
        user.password = hashedPassword;
        user.reset = null;
        user.save();
      } else if (asociacion) {
        asociacion.password = hashedPassword;
        asociacion.reset = null;
        asociacion.save();
      }

      return 'Changed password successfully';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async createAdminPassword(newPassword: string, reset: string | string[]) {
    try {
      if (!(reset && newPassword))
        throw new BadRequestException('All fields are required');
      let hashedPassword: string;
      if (
        newPassword.includes(SKP.K) &&
        newPassword[0] === SKP.F &&
        newPassword[newPassword.length - 1] === SKP.F
      ) {
        hashedPassword = await hash(newPassword, 15);
      }

      const admin = await this.usersService.findByToken(reset);

      if (admin) {
        admin.password = hashedPassword;
        admin.reset = null;
        admin.save();
      } else {
        throw new BadRequestException('Incorrect token!');
      }
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async verifyUser(id: string): Promise<string | ErrorsDto> {
    try {
      let user;
      let asociacion;
      try {
        user = await this.usersService.findById(id);
      } catch (error) {
        console.log(error.message);
      }
      try {
        asociacion = await this.asociacionesService.findOne(id);
      } catch (error) {
        console.log(error.message);
      }

      if (!user && !asociacion) return { message: 'Usuario no registrado', status: 404 };

      //New email verification
      try {
        if (user) {
          if (user.newEmail) {
            user.email = user.newEmail;
            await user.save();
            return 'Changed email successfully';
          }
        }
      } catch (error) {
        return { message: error.message, status: error.status };
      }
      try {
        if (asociacion) {
          if (asociacion.newEmail) {
            asociacion.email = asociacion.newEmail;
            await asociacion.save();
            return 'Changed email successfully';
          }
        }
      } catch (error) {
        return { message: error.message, status: error.status };
      }

      //Normal verification
      if (user) {
        if (user.verified) return 'Ya está verificado';
        user.verified = true;
        await user.save();
      } else if (asociacion) {
        if (asociacion.verified) return 'Ya está verificado';
        asociacion.verified = true;
        await asociacion.save();
      } else {
        throw new BadRequestException('No está registrado');
      }
      return 'Verified User';
    } catch (error) {
      return { message: error.message, status: error.status };
    }
  }
}
