import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAsoc(email: string, password: string): Promise<Asociaciones> {
    const asociaciones = await this.asociacionesService.findAll();
    const asociacion = asociaciones.find((a) => a.email === email);

    console.log(asociacion);
    if (asociacion && await asociacion.comparePassword(password)) {
      return asociacion;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(asociacion: Asociaciones): Promise<{ accessToken: string }> {
    const payload = { email: asociacion.email, sub: asociacion.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}