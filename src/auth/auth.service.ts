import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { hash, compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { FileService } from 'src/file/file.service';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly mailsService:MailsService,
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

    return { ...usuario, token };
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

      //Checking if email is registered
      const user = await this.usersService.findByEmail(email);
      const asociacion =  await this.asociacionesService.findByEmail(email);

      if (!user && !asociacion) throw new NotFoundException('This user is not registered');

      let token;

      if (user) {
        token = this.jwtService.sign({ email: user.email, sub: user.id, rol: 'user' }, { expiresIn:'10min' });
        user.reset = token;
        user.save();
      }
      if (asociacion) {
        token = this.jwtService.sign({ email: asociacion.email, sub: asociacion.id, rol: 'fundation' }, { expiresIn: '10min' });
        asociacion.reset = token;
        asociacion.save();
      } 

      //Proximamente lógica para el envío de emails
      this.mailsService.sendMails(user, 'RESET_PASSWORD');
      
      return { message:'Check your email for a token' };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyToken(token:string):Promise<any> {
    try {
      const user = await this.usersService.findByToken(token);
      const asociacion = await this.asociacionesService.findByToken(token);

      if (!user && !asociacion) throw new NotFoundException('Token erróneo');

      if (user) {
  
        const payload = { email: user.email, sub: user.id, rol: 'user' };
        const newToken = this.jwtService.sign(payload, { expiresIn:'10min' });
        user.reset = newToken;
        user.save();
        return { token:newToken, expirationTime:'10min' };
      }
      if (asociacion) {
        const payload = { email: asociacion.email, sub: asociacion.id, rol: 'fundation' };
        const newToken = this.jwtService.sign(payload, { expiresIn:'10min' });
        asociacion.reset = newToken;
        asociacion.save();
        return {  token:newToken, expirationTime:'10min' };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createNewPassword(newPassword, reset:string | string[]):Promise<string> {

    try {
      if (!(reset && newPassword)) throw new BadRequestException('All fields are required');

      //Checking if it's a user or an asociation
      const user = await this.usersService.findByToken(reset);
      const asociacion = await this.asociacionesService.findByToken(reset);

      if (!user && !asociacion) throw new NotFoundException('Something went wrong');

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
      console.log(error);
      return error.message;
    }
  }
}