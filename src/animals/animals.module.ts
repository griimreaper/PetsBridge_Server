import { Module } from '@nestjs/common';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { animalsProviders } from './animals.providers';
import { FileService } from '../file/file.service';
import { asociacionesProviders } from '../asociaciones/providers/asociaciones.provider';

@Module({
  controllers: [AnimalsController],
  providers: [ ...animalsProviders, AnimalsService, FileService, ...asociacionesProviders ],
  exports: [AnimalsService],
})
export class AnimalsModule {}
