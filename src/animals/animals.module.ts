import { Module } from '@nestjs/common';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { animalsProviders } from './animals.providers';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [AnimalsController],
  providers: [ ...animalsProviders, AnimalsService, FileService ],
  exports: [AnimalsService],
})
export class AnimalsModule {}
