import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AsociacionesModule,
    DatabaseModule,
    AuthModule,
    AnimalsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;

  constructor(private readonly configureService: ConfigService) {
    AppModule.port = parseInt(configureService.get('SERVER_PORT'));
  }
}
