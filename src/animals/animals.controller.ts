import { Controller, Post, Body } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Post()
  createPet(@Body() pet:AnimalDto):Promise<string> {
    return this.animalsService.postPet(pet);
  }
}
