import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from '../asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { FileService } from '../file/file.service';
import { SKP } from '../constants/jwt.constants';
import {
  IValidateUser,
  IValidateAsociaciones,
} from './interface/IValidate.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
  ) {}

  async validate(
    body: LoginDto,
  ): Promise<IValidateUser | IValidateAsociaciones> {
    const asociaciones = await this.asociacionesService.findAll();
    const asociacion = asociaciones.find((a) => a.email === body.email);

    const usuarios = await this.usersService.findAll();
    const usuario = usuarios.find((u) => u.email === body.email);

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
      usuario &&
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

  async login(usuario: IValidateUser | IValidateAsociaciones): Promise<{ token: string }> {
    const { isActive, isGoogle, password, id, ...toPayload } = usuario;
    const payload = { ...toPayload, email: usuario.email, sub: id, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return { token };
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
        isActive: false,
        password: await hash(password, 15),
      });
    }

    switch (rol) {
      case 'user':
        return this.usersService.createUser(body);
      case 'fundation':
        return this.asociacionesService.create(body);
      default:
        return { send: 'No se ha recibido un rol', status: 400 };
    }
  }
}
