import { Module } from '@nestjs/common';
import { AsociacionesController } from './asociaciones.controller';
import { AsociacionesService } from './asociaciones.service';
import { asociacionesProviders } from './providers/asociaciones.provider';
import { FileService } from 'src/file/file.service';
import { databaseProviders } from 'src/database/database.provider';


@Module({
  controllers: [AsociacionesController],
  providers: [
    AsociacionesService, 
    ...asociacionesProviders,
    ...databaseProviders,
    FileService],
  exports: [AsociacionesService],
})
export class AsociacionesModule {}
