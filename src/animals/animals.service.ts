import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { Op } from 'sequelize';
import { FileService } from 'src/file/file.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject('ANIMALS_REPOSITORY') private readonly animalsRepository:typeof Animal,
    private readonly filesService:FileService,
  ) {}

  async getPets(): Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
      return animals;      
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async postPet(pet:AnimalDto, file:Express.Multer.File[]):Promise<string> {
    try {
      const urls:any = Array.isArray(file) ? await this.filesService.createFiles(file) : null;
      await this.animalsRepository.create({
        ...pet,
        image: urls,
      });

      return 'Posted successfully';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getAllPets():Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll({
        where:{
          status:{
            [Op.or]:['homeless', 'pending'],
          },
        },
      });
      return animals;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getPet(id:string):Promise<Animal> {
    try {
      const animal = await this.animalsRepository.findByPk(id, {
        include: Asociaciones,
      } );
      console.log( animal);
      return animal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async deletePet(id:string):Promise<string> {
    try {
      const animal = await this.animalsRepository.findByPk(id);
      await animal.destroy();
      return 'Deleted succesfully';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
   
  }
}
