import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Res,
  UseInterceptors,
  UploadedFile,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        .json({ error: 'El email ya esta en uso' });
    }
  }

  @Post('login')
  async loginAc(@Body() loginDto: LoginDto, @Res() res : Response) {
    const user = await this.authService.validate(loginDto);
    const token: any = await this.authService.login(user);

    res.status(200).setHeader('Authorization', `${token?.token}`).json({ ...token, id: user.id });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() email) {
    return this.authService.forgotPassword(email.email);
  }   
    
  @UseGuards(JwtAuthGuard)
  @Post('verify-token')
  async veriftToken(@Body() body, @Res() response: Response, @Req() request:Request) {
    const { rol } = body;
    const { code } = request.headers;
    const newtoken = await this.authService.verifyToken( code, rol );

    response.setHeader('Authorization', newtoken.token).json(newtoken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('create-password')
  async createNewPassword(@Body() newPassword, @Req() request:Request) {
    const { reset } = request.headers;
    return this.authService.createNewPassword(newPassword.newPassword, reset);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('create-admin-password')
  async createAdminPassword(@Body() body, @Req() request:Request) {
    const { newPassword } = body;
    const { reset } = request.headers;

    return this.authService.createAdminPassword(newPassword, reset);
  }

  @Patch('verify')
  async verify(@Query('id') id:string) {
    return this.authService.verifyUser(id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // Este método se ejecutará automáticamente al acceder a la ruta "/auth/google"
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res:Response): Promise<void> {
    await console.log('hola'); // Aquí se encuentra el objeto con los datos del usuario autenticado
    const user = req.user; // Accede al email del usuario
  
    console.log(user); // Muestra el email en la consola
    // Este método se ejecutará automáticamente después de la autenticación exitosa en Google
    res.redirect('/home'); // Redirige al usuario a la página deseada después de la autenticación exitosa
  }
}
