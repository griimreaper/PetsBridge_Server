import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { imagenProviders } from './Providers/imagenes.providers';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileService, ...imagenProviders],
})
export class FileModule {}
