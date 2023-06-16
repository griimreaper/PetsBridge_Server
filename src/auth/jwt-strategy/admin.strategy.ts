import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstanst } from '../../constants/jwt.constants';
import { UsersService } from '../../users/users.service';
import { AsociacionesService } from '../../asociaciones/asociaciones.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly asociacionesService: AsociacionesService,
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
        try {
          user = await this.usersService.findById(payload.sub);
        } catch (error) {
          console.log(error.message);
        }
      case 'fundation':
        try {
          asociacion = await this.asociacionesService.findOne(payload.sub);
        } catch (error) {
          console.log(error.message);
        }
      case 'admin':
        try {
          admin = await this.usersService.findById(payload.sub);
        } catch (error) {
          console.log(error.message);
        }
    }
    if (!user && !asociacion && !admin) throw new UnauthorizedException('You are not authorized to perform the operation');
    return payload;
  }
  /* async validate(payload: any) {
      return { id: payload.sub, email: payload.email, rol: payload.rol };
    } */
}
