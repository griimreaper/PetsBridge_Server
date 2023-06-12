import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { AsociacionesModule } from '../asociaciones/asociaciones.module';
import { jwtConstanst } from '../constants/jwt.constants';
import { UsersModule } from '../users/users.module';
import { FileService } from '../file/file.service';
import { JwtAuthGuard } from './jwt-auth.guard';


@Module({
  imports: [
    AsociacionesModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstanst.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, FileService, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}

