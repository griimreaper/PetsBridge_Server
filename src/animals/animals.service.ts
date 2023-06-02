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
}
