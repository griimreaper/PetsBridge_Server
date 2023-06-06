import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './file/multer.config';
import { DatabaseModule } from './database/database.module';
import { PublicationsUsersModule } from './publications_users/publications_users.module';
import { DonationsModule } from './donations/donations.module';
import { AuthModule } from './auth/auth.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { AsPublicationsModule } from './as_publications/as_publications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    FileModule,
    MulterModule.register(multerConfig),
    UsersModule,
    AsociacionesModule,
    DatabaseModule,
    AnimalsModule,
    PublicationsUsersModule,
    DonationsModule,
    AdoptionsModule,
    AsPublicationsModule,
    AuthModule,
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
