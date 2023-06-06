import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { Op } from 'sequelize';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject('ANIMALS_REPOSITORY') private readonly animalsRepository:typeof Animal,
    private readonly filesService:FileService,
  ) {}

  async getPets(): Promise<Animal[]> {
    const animals = await this.animalsRepository.findAll();
    return animals;
  }

  async postPet(pet:AnimalDto, file:Express.Multer.File[]):Promise<string> {
    try {
      if (Array.isArray(file)) {
        const urls: any = await this.filesService.createFiles(file) ;
        await this.animalsRepository.create<Animal>({ ...pet, images:urls });
        return 'Posted successfully';
      }

      await this.animalsRepository.create<Animal>(pet);

      return 'Posted successfully';
    } catch (error) {
      console.log(error.message);
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
      console.log(error.message);
    }
  }

  async getPet(id:string):Promise<Animal> {
    try {
      const animal = await this.animalsRepository.findByPk(id);
      return animal;
    } catch (error) {
      console.log(error.message);
    }
  }

  async deletePet(id:string):Promise<string> {
    try {
      const animal = await this.animalsRepository.findByPk(id);
      await animal.destroy();
      return 'Deleted succesfully';
    } catch (error) {
      console.log(error.message);
    }
   
  }
}
