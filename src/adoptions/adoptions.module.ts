import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { adoptionsProviders } from './adoptions.providers';
import { usersProviders } from 'src/users/users.provider';
import { animalsProviders } from 'src/animals/animals.providers';

@Module({
  providers: [AdoptionsService, ...adoptionsProviders, ...usersProviders, ...animalsProviders],
  controllers: [AdoptionsController],
  exports: [AdoptionsService],
})
export class AdoptionsModule {}
