import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstanst } from '../../constants/jwt.constants';
import { UsersService } from '../../users/users.service';
import { AsociacionesService } from '../../asociaciones/asociaciones.service';

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

<<<<<<<< HEAD:src/auth/jwt-strategy/admin.strategy.ts
  async validate(payload: any) {
    const rol = payload.rol;
    if (!rol || rol !== 'admin') {
      throw new UnauthorizedException('You are not authorized to perform the operation');
    }
========
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
>>>>>>>> dae72ccbad3839716b637e9faecc95a3bb788efc:src/auth/jwt-strategy/jwt-strategy.service.ts
    return payload;
  }
  /* async validate(payload: any) {
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  } */
}