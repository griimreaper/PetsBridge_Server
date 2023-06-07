import { Controller, Post, Body, Get, HttpCode, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
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

  @HttpCode(201)
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
