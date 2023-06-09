import { Controller, Post, Body, HttpStatus, Res, UseInterceptors, UploadedFile, Put, Patch, Headers, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file/multer.config';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registrar fundacion o usuario con authenticacion
  // Se debe recibir por json:
  //  {
  //     "email": "ejemplo@gmail.com",
  //     "password":  "12345678",
  //     "rol": "fundation" | "user"
  //  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('profilePic', multerConfig),
  )
  async register(@Body() body :LoginDto, @Res() response: Response, @UploadedFile() profilePic?: Express.Multer.File) {
    try {
      const resp = await this.authService.register(body, profilePic);
      switch (resp.status) {
        case HttpStatus.CREATED:
          response.status(HttpStatus.CREATED).send(resp.send);
          break;
        case HttpStatus.BAD_REQUEST:
          response.status(HttpStatus.BAD_REQUEST).send(resp.send);
          break;
        default:
          response.status(HttpStatus.BAD_REQUEST).send(resp.send);
      }
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Post('login')
  async loginAc(@Body() loginDto: LoginDto, @Res() response: Response) {
    const user = await this.authService.validate(loginDto);
    const token = await this.authService.login(user);

    response.setHeader('Authorization', `Bearer ${token.token}`).json(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() email) {
    return this.authService.forgotPassword(email.email);
  }

  @Patch('create-password')
  async createNewPassword(@Body() newPassword, @Req() request:Request) {
    return this.authService.createNewPassword(newPassword.newPassword, request.headers.reset);
  } 
  
}