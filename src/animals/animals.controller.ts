import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file/multer.config';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @Get()
  allPets() {
    return this.animalsService.getPets();
  }


  @Post()
  @UseInterceptors(FilesInterceptor('file', undefined, multerConfig))
  createPet(@Body() pet:AnimalDto, @UploadedFiles() file:Express.Multer.File[]) {
    return this.animalsService.postPet(pet, file);
  }
}
