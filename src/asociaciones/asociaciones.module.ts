import { Module } from '@nestjs/common';
import { AsociacionesController } from './asociaciones.controller';
import { AsociacionesService } from './asociaciones.service';
import { asociacionesProviders } from './providers/asociaciones.provider';
import { FileService } from '../file/file.service';
import { databaseProviders } from '../database/database.provider';
import { animalsProviders } from 'src/animals/animals.providers';
import { adoptionsProviders } from 'src/adoptions/adoptions.providers';


@Module({
  controllers: [AsociacionesController],
  providers: [
    AsociacionesService,
    ...asociacionesProviders,
    ...databaseProviders,
    ...animalsProviders,
    ...adoptionsProviders,
    FileService],
  exports: [AsociacionesService],
})
export class AsociacionesModule {}
