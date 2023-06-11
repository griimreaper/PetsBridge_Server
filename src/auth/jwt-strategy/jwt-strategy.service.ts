import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstanst } from '../../constants/jwt.constants';
import { UsersService } from 'src/users/users.service';
import { AsociacionesService } from 'src/asociaciones/asociaciones.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService:UsersService,
    private readonly asociacionesService:AsociacionesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstanst.secret,
    });
  }

  async validate(payload:any) {
    let user;
    let asociacion;
    let admin;
    switch (payload.rol) {
      case 'user':
        user = await this.usersService.findById(payload.id);
      case 'fundation':
        asociacion = await this.asociacionesService.findOne(payload.id);
      case 'admin':
        admin = await this.usersService.findById(payload.id);
    }
    if (!user && !asociacion && !admin) throw new UnauthorizedException('You are not authorized to perform the operation');
    return payload;
  }
  /* async validate(payload: any) {
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  } */
}