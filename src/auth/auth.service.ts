import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entity/users.entity';
import { LoginDto, UserRole } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validate({ email, password, rol }: LoginDto): Promise<Asociaciones | Users> {
    let result: Asociaciones | Users;

    switch (rol) {
      case UserRole.FUNDATION: {
        const asociaciones = await this.asociacionesService.findAll();
        const asociacion = asociaciones.find((a) => a.email === email);
        if (asociacion && (await compare(password, asociacion.password))) {
          result = asociacion;
        }
        break;
      }
      case UserRole.USER: {
        const usuarios = await this.usersService.findAll();
        const usuario = usuarios.find((u) => u.email === email);
        if (usuario && (await compare(password, usuario.password))) {
          result = usuario;
        }
        break;
      }
      default:
        throw new HttpException('INVALID_DATA', 404);
    }
    if (!result) {
      throw new HttpException('PASSWORD_INCORRECT_OR_FAILURE_ROL', 403);
    }
    return result;
  }

  async login(usuario: Asociaciones | Users, rol: UserRole ): Promise<{ token: string }> {
    const payload = { email: usuario.email, sub: usuario.id, rol: rol };
    const token = this.jwtService.sign(payload);

    return { ...usuario.dataValues, token };
  }

  async register(register: any) {
    const { password } = register;
    const hashedPassword = await hash(password, 10);
    let { rol, ...body } = register;
    rol = rol;
    body = { ...body, password: hashedPassword };
    switch (rol) {
      case UserRole.USER:
        return this.usersService.createUser(body);
        break;
      case UserRole.FUNDATION:
        return this.asociacionesService.create(body);
        break;
    }
  }

}