import { Injectable, Inject } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';

@Injectable()
export class AnimalsService {
  constructor(@Inject('ANIMALS_REPOSITORY') private readonly animalsRepository:typeof Animal) {}

  async postPet(pet:AnimalDto):Promise<string> {
    try {

      await this.animalsRepository.create<Animal>(pet);

      return 'Posted successfully';
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllPets():Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
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
      return 'Deleted succesfully';
    } catch (error) {
      console.log(error.message);
    }
   
  }
}
