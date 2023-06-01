import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly asociacionesService: AsociacionesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<Asociaciones> {
    const asociacion = await this.asociacionesService.findOne(payload.sub);

    if (!asociacion) {
      throw new UnauthorizedException('Invalid token');
    }

    return asociacion;
  }
}