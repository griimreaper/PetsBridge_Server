import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { hash, compare } from 'bcrypt';
import { CreateAsociacionDto } from 'src/asociaciones/dto/create-asociacion.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAsoc(email: string, password: string): Promise<Asociaciones> {
    const asociaciones = await this.asociacionesService.findAll();
    const asociacion = asociaciones.find((a) => a.email === email);
    if (!asociacion) throw new HttpException('ASOC_NOT_FOUND', 404);

    const checkPassword = await compare(password, asociacion.password);
    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);
    
    return asociacion;
  }

  async login(asociacion: Asociaciones): Promise<{ token: string }> {
    const payload = { email: asociacion.email, sub: asociacion.id };
    const token = this.jwtService.sign(payload);

    return { ...asociacion.dataValues, token };
  }

  async register(body: CreateAsociacionDto) {
    const { password } = body;
    const hashedPassword = await hash(password, 10);
    body = { ...body, password: hashedPassword };
    return this.asociacionesService.create(body);
  }
}