import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { adoptionsProviders } from './adoptions.providers';

@Module({
  providers: [AdoptionsService, ...adoptionsProviders],
  controllers: [AdoptionsController],
})
export class AdoptionsModule {}
