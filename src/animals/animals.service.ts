import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { FileService } from 'src/file/file.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject('ANIMALS_REPOSITORY') 
    private readonly animalsRepository:typeof Animal,
    @Inject('ASOCIACIONES_REPOSITORY')
    private readonly asociationRepository: typeof Asociaciones,
    private readonly fileService: FileService,
  ) {}

  async getPets(): Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
      return animals;      
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async postPet(pet:AnimalDto, file: Express.Multer.File[]):Promise<string> {
    try {
      const urls:any = Array.isArray(file) ? await this.fileService.createFiles(file) : null;
      await this.animalsRepository.create({
        ...pet,
        image: urls,
      });

      return 'La mascota se ha registrado!';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getAllPets():Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
      return animals;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getPet(id:string):Promise<Animal> {
    try {
      const animal = await this.animalsRepository.findByPk(id, {
        include: [Asociaciones, Users],
      } );
      return animal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async animalAssoc(id: string) {
    const AsocAnimal = await this.asociationRepository.findByPk(id, {
      include: Animal,
    });
    return AsocAnimal;
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
