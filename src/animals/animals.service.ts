import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';

@Injectable()
export class AnimalsService {
  constructor(@Inject('ANIMALS_REPOSITORY') private readonly animalsRepository:typeof Animal) {}

  async getPets(): Promise<Animal[]> {
    const animals = await this.animalsRepository.findAll();
    return animals;
  }

  async postPet(pet:AnimalDto):Promise<string> {
    try {
      await this.animalsRepository.create<Animal>(pet);

      return 'Posted successfully';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }
}
