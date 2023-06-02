import { Module } from '@nestjs/common';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { animalsProviders } from './animals.providers';

@Module({
  controllers: [AnimalsController],
  providers: [ ...animalsProviders, AnimalsService ],
})
export class AnimalsModule {}
