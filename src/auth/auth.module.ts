import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { AsociacionesModule } from 'src/asociaciones/asociaciones.module';
import { jwtConstanst } from '../constants/jwt.constants';

@Module({
  imports: [
    AsociacionesModule,
    JwtModule.register({
      secret: jwtConstanst.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

