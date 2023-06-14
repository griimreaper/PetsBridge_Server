import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
import { MailsService } from '../mails/mails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly mailsService:MailsService,
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
    const { verified, isActive, isGoogle, password, id, ...toPayload } = usuario;
    //if (!verified) throw new ForbiddenException('Este usuario no está verificado');
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

    const date = new Date();
    const code = await hash(`${date.getTime()}`, 10);

    switch (rol) {
      case 'user':
        const user = await this.usersService.createUser(body);
        this.mailsService.sendMails({ ...user.user.dataValues, code:code }, 'VERIFY_USER');
        console.log(user.user.dataValues.id);
        return user;
      case 'fundation':
        const asociacion = await this.asociacionesService.create(body);
        this.mailsService.sendMails(asociacion.asociacion.dataValues, 'VERIFY_USER');
        console.log(asociacion.asociacion.dataValues.id);
        return asociacion;
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
      const asociacion =  await this.asociacionesService.findByEmail(email);
      const user = await this.usersService.findByEmail(email);
      

      if (!user && !asociacion) throw new NotFoundException('This user is not registered');

      /*       const date = new Date();
      const token = await hash(`${date.getTime()}`, 10); */
      let token;

      if (user) {
        token = await this.jwtService.sign({ email: user.email, sub: user.id, rol: 'user' }, { expiresIn:'10min' });
        user.reset = token;
        await user.save();
        await this.mailsService.sendMails(user.dataValues, 'RESET_PASSWORD');
      }
      if (asociacion) {
        token = await this.jwtService.sign({ email: asociacion.email, sub: asociacion.id, rol: 'fundation' }, { expiresIn: '10min' });
        asociacion.reset = token;
        await asociacion.save();
        await this.mailsService.sendMails(asociacion.dataValues, 'RESET_PASSWORD');
      } 
      
      return { message:'Check your email for a token' };
    } catch (error) {
      console.log(error.message);
    }
  }

  async verifyToken( token:string | string[], rol?:string):Promise<any> {
    try {
      let user;
      let asociacion;
      try {
        user = await this.usersService.findByToken(token);
      } catch (error) {
        console.log(user);
      }
      try {
        asociacion = await this.asociacionesService.findByToken(token);
      } catch (error) {
        console.log(asociacion);
      }
      
      if (!user && !asociacion) throw new NotFoundException('Token erróneo');

      if (user) {
  
        const payload = rol === 'admin'
          ? { email: user.email, sub: user.id, rol: 'admin' }
          : { email: user.email, sub: user.id, rol: 'user' };

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
      return error;
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
      return error;
    }
  }

  async createAdminPassword(newPassword:string, reset:string | string[]) {
    try {
      if (!(reset && newPassword)) throw new BadRequestException('All fields are required');
      let hashedPassword:string;
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
      console.log(error.message);
      return error;
    }
  }

  async verifyUser(id:string) {
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
        console.log(asociacion);
      }
      

      if (user) {
        if (user.verified) return 'Ya está verificado';
        user.verified = true;
        user.save();
      } else if (asociacion) {
        if (asociacion.verified) return 'Ya está verificado';
        asociacion.verified = true;
        asociacion.save();
      } else {
        throw new BadRequestException('No está registrado');
      }
      return 'Verified User';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
