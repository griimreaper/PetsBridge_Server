import { Injectable, Inject } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AnimalsService {
  constructor(
    @Inject('ANIMALS_REPOSITORY') 
    private readonly animalsRepository:typeof Animal,
    private readonly fileService: FileService,
  ) {}

  async getPets(): Promise<Animal[]> {
    const animals = await this.animalsRepository.findAll();
    return animals;
  }

  async postPet(pet:AnimalDto, file: Express.Multer.File[]):Promise<string> {
    try {

      console.log(pet, 'PEEEEEEEEEEEEEEETTTTTT');
      if (file.length) {
        const URLS = await this.fileService.createFiles(file);
        pet.imagen = URLS;
      }
      await this.animalsRepository.create<Animal>(pet);

      return 'Posted successfully';
    } catch (error) {
      console.log(error.message);
    }
  }
}
