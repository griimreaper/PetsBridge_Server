import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Adoption } from './adoptions.entity';
import { AdoptionDto } from './dto/adoptions.dto';
import { Users } from 'src/users/entity/users.entity';
import { Animal } from 'src/animals/animals.entity';
@Injectable()
export class AdoptionsService {
  constructor(
    @Inject('ADOPTIONS_REPOSITORY') private readonly adoptionsRepository: typeof Adoption,
    @Inject('USERS_REPOSITORY') private readonly usersRepository: typeof Users,
    @Inject('ANIMALS_REPOSITORY') private readonly animalsRepository: typeof Animal,
  ) {}

  async adopt(IDS: AdoptionDto): Promise<string> { 
    try {
      const user = await this.usersRepository.findByPk(IDS.userID);
      const animal = await this.animalsRepository.findOne({ where: { id: IDS.animalID } });
      if (user && animal) {
        await this.adoptionsRepository.create({
          userID: user.id,
          animalID: animal.id,
        });

        return 'Adopted successfully';
      } else {
        throw new HttpException('User or animal not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Adoption failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
