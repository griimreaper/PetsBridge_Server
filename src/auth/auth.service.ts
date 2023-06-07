import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto, UserRole } from './dto/login.dto';
import { FileService } from 'src/file/file.service';

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
    if (usuario && await compare(body.password, usuario.password)) return { ...usuario.dataValues, rol:'user' };
    
    throw new HttpException('PASSWORD_INCORRECT', 403);
  }

  async login(usuario: any ): Promise<{ token: string }> {
    const payload = { email: usuario.email, sub: usuario.id, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return { ...usuario.dataValues, token };
  }

  async register(register: any, profilePic?:Express.Multer.File) {
    const { password } = register;
    const hashedPassword = await hash(password, 10);
    let { rol, ...body } = register;
    rol = rol;
    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      body = { ...body, password: hashedPassword, img_profile: url };
    } else {
      body = { ...body, password: hashedPassword };
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

  async forgotPassword(email:string) {
    try {
      if (!email) {
        throw new BadRequestException('Must provide a valid email');
      }

      const message = 'Check your email for a link to reset password';
      const emailStatus = 'OK';
      let jwt; 

      //Checking if email is registered
      const user = await this.usersService.findByEmail(email);
      const asociacion =  await this.asociacionesService.findByEmail(email);

      if (!user && !asociacion) throw new NotFoundException('This user is not registered');

      if (user) {
        jwt = this.jwtService.sign({ email:user.email, sub:user.id, rol:'user' }, { expiresIn:'10m' });
        user.reset = jwt;
        user.save();
      }
      if (asociacion) {
        jwt = this.jwtService.sign({ email:user.email, sub:user.id, rol:'fundation' }, { expiresIn:'10min' });
        asociacion.reset = jwt;
        asociacion.save();
      } 

      const verificationLink = `localhost:3001/${jwt}`;

      //Proximamente lógica para el envío de emails
      
      return { message:message, status:emailStatus, verificationLink:verificationLink };
    } catch (error) {
      throw new HttpException('Something went wrong', error.response.status, { cause:error });
    }
  }

  async createNewPassword(newPassword:string, reset:string | string[]):Promise<string> {

    try {
      if (!(reset && newPassword)) throw new BadRequestException('All fields are required');
      const hashedPassword = await hash(newPassword, 10);
      //Checking if it's a user or an asociation
      const user = await this.usersService.findByReset(reset);
      const asociacion = await this.asociacionesService.findByReset(reset);

      if (!(user && asociacion)) throw new NotFoundException('Something went wrong');

      if (user) {
        user.password = hashedPassword;
        user.save();
      } else if (asociacion) {
        asociacion.password = hashedPassword;
        asociacion.save();
      }

      return 'Changed password successfully';
    } catch (error) {
      throw new HttpException('Something went wrong', error.response.status, { cause:error });
    }
  }
}