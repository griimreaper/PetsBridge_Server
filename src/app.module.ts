import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './file/multer.config';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    MulterModule.register(multerConfig),
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
