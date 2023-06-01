import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './file/multer.config';
import { FileService } from './file/file.service';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    MulterModule.register(multerConfig),
  ],
  controllers: [AppController, FileController],
  providers: [AppService, FileService],
})
export class AppModule {
  static port: number;

  constructor(private readonly configureService: ConfigService) {
    AppModule.port = parseInt(configureService.get('SERVER_PORT'));
  }
}
