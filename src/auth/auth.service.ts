import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { FileService } from 'src/file/file.service';
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

    if (!asociacion && !usuario) throw new HttpException('El email no existe', 404);

    if (asociacion && (await compare(body.password, asociacion.password))) {
      const result: IValidateAsociaciones = {
        ...asociacion.dataValues,
        rol: 'fundation',
      };
      return result;
    }
    if (usuario && (await compare(body.password, usuario.password))) {
      const result: IValidateUser = { ...usuario.dataValues, rol: 'user' };
      return result;
    }

    throw new HttpException('PASSWORD INCORRECT', 403);
  }

  async login(usuario: any): Promise<{ token: string }> {
    const payload = { email: usuario.email, sub: usuario.id, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async register(register: any, image?: Express.Multer.File) {
    const { password } = register;
    console.log(register);
    const hashedPassword = await hash(password, 10);
    let { rol, ...body } = register;
    rol = rol;
    if (image) {
      console.log(image);
      const url = await this.fileService.createFiles(image);
      body = { ...body, password: hashedPassword, image: url };
    } else {
      body = { ...body, password: hashedPassword };
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
