import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Post()
  createPet(@Body() pet:AnimalDto):Promise<string> {
    return this.animalsService.postPet(pet);
  }

  @Get()
  getAllPets() {
    return this.animalsService.getAllPets();
  }

  @Get(':id')
  getPet(@Param('id') id:string) {
    return this.animalsService.getPet(id);
  }
}
