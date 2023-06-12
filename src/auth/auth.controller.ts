import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';

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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async register(
  @Body() body: RegisterDto,
    @Res() response: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    try {
      const resp = await this.authService.register(body, image);
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
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Post('login')
  async loginAc(@Body() loginDto: LoginDto) {
    const user = await this.authService.validate(loginDto);
    const token = await this.authService.login(user);
    return { ...token, id: user.id };
  }
}
