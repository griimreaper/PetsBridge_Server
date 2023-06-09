import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file/multer.config';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.animalsService.getPet(id);
  }

  @Get()
  allPets() {
    return this.animalsService.getAllPets();
  }


  @Post()
  @UseInterceptors(FilesInterceptor('file', undefined, multerConfig))
  createPet(@Body() pet:AnimalDto, @UploadedFiles() file:Express.Multer.File[]) {
    return this.animalsService.postPet(pet, file);
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
