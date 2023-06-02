import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateAsociacionDto } from 'src/asociaciones/dto/create-asociacion.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registerFundation')
  async registerAsoc(@Body() body :CreateAsociacionDto, @Res() response: Response) {
    try {
      const resp = await this.authService.register(body);
      switch (resp.status) {
        case HttpStatus.CREATED:
          response.status(HttpStatus.CREATED).send(resp.send);
          break;
        case HttpStatus.BAD_REQUEST:
          response.status(HttpStatus.BAD_REQUEST).send(resp.send);
          break;
      }
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Post('login')
  async loginAc(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateAsoc(email, password);
    const token = await this.authService.login(user);
    return token;
  }
  
}