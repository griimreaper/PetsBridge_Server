import { Controller, Post, Body, Get, UseInterceptors, UploadedFiles, Param, HttpCode, HttpException, HttpStatus, Query, Patch, Put, Delete, UseGuards } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalDto } from './dto/animals.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Animal } from './animals.entity';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private animalsService: AnimalsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/paginate')
  animalPaginate(@Query('currentPage') currentPage: string, @Query('slicePage') slicePage: string) {
    return this.animalsService.paginate(Number(currentPage), Number(slicePage));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/animalsFake') 
  fakeAnimal() {
    return this.animalsService.generateAnimal();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/filtro')
  filtSpecie( @Query('filtro') filtro: string) {
    return this.animalsService.filtSpecie(filtro);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.animalsService.getPet(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  allPets() {
    return this.animalsService.getAllPets();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('file', undefined, multerConfig))
  createPet(
    @GetUser() user: any,
      @Body() pet:AnimalDto,
      @UploadedFiles() file:Express.Multer.File[],
  ): Promise<string> {
    pet = { ...pet, userId: user.id };
    return  this.animalsService.postPet(pet, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/animalAsoc/:id')
  animalByAssoc(@Param('id') id: string): Promise<Asociaciones> {
    return this.animalsService.animalAssoc(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/editAnimal/:id')
  @UseInterceptors(FilesInterceptor('file', 5, multerConfig))
  async editAnimal(
  @Param('id') id: string,
    @GetUser() user: any,
    @Body() pet: AnimalDto,
    @UploadedFiles() file:Express.Multer.File[],
  ) {
    try {
      const userDog = await Animal.findByPk(id);
      if (userDog.userId !== user.id) throw new HttpException('Forbidden resource', 403);
      return await this.animalsService.editAnimals(id, pet, file);
    } catch (error) {
      throw new HttpException('Este animal no existe.', 400);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePet(
  @GetUser() user: any,
    @Param('id') id:string,
  ) {
    try {
      const userDog = await Animal.findByPk(id);
      if (userDog.userId !== user.id) throw new HttpException('Forbidden resource', 403);
      return await this.animalsService.deletePet(id);
    } catch (error) {
      throw new HttpException('Este animal no existe.', 400);
    }
  }
}
