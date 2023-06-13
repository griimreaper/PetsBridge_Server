import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles, Param, HttpCode, HttpException, HttpStatus, Query, Patch, Put, Delete } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}
  
  @Get('/paginate')
  animalPaginate(@Query('currentPage') currentPage: string, @Query('slicePage') slicePage: string) {
    return this.animalsService.paginate(Number(currentPage), Number(slicePage));
  }
  
  @Get('/animalsFake') 
  fakeAnimal() {
    return this.animalsService.generateAnimal();
  }  

  @Get('/filtro')
  filtSpecie( @Query('filtro') filtro: string) {
    return this.animalsService.filtSpecie(filtro);
  }
  
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
  createPet(@Body() pet:AnimalDto, @UploadedFiles() file:Express.Multer.File[]): Promise<string> {
    return  this.animalsService.postPet(pet, file);
  }

  @Get('/animalAsoc/:id')
  animalByAssoc(@Param('id') id: string): Promise<Asociaciones> {
    return this.animalsService.animalAssoc(id);
  }

  @Put('/editAnimal/:id')
  @UseInterceptors(FilesInterceptor('file', 5, multerConfig))
  editAnimal(@Param('id') id: string, @Body() pet: AnimalDto, @UploadedFiles() file:Express.Multer.File[]) {
    
    return this.animalsService.editAnimals(id, pet, file);
  }

  @Delete(':id')
  deletePet(@Param('id') id:string) {
    return this.animalsService.deletePet(id);
  }
}
