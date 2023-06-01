import { Injectable, Inject } from '@nestjs/common';
import { Adoption } from './adoptions.entity';
import { AnimalDto } from 'src/animals/dto/animals.dto';
import { AdoptionDto } from './dto/adoptions.dto';

@Injectable()
export class AdoptionsService {
  constructor(@Inject('ADOPTIONS_REPOSITORY') private readonly adoptionsRepository:typeof Adoption) {}

  async adopt(IDS:AdoptionDto):Promise<string> {
    try {
      const AdoptedAt = await this.adoptionsRepository.create<Adoption>(IDS);
      return 'Adopted successfully';
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAdoptions():Promise<Adoption[]> {
    const adoptions = await this.adoptionsRepository.findAll();
    return adoptions;
  }
}
