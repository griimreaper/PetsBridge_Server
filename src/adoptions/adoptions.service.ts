import { Injectable, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Adoption } from './adoptions.entity';
import { AdoptionDto } from './dto/adoptions.dto';
import { Users } from 'src/users/entity/users.entity';
import { Animal } from 'src/animals/animals.entity';
import { MailsService } from 'src/mails/mails.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AdoptionsService {
  constructor(
    @Inject('ADOPTIONS_REPOSITORY') private readonly adoptionsRepository: typeof Adoption,
    @Inject('USERS_REPOSITORY') private readonly usersRepository: typeof Users,
    @Inject('ANIMALS_REPOSITORY') private readonly animalsRepository: typeof Animal,
    private readonly mailsService:MailsService,
  ) {}

  async adopt(IDS: AdoptionDto): Promise<string> { 
    try {
      const userData = await this.usersRepository.findByPk(IDS.userID);
      const animalData = await this.animalsRepository.findOne({ where: { id: IDS.animalID } });
      if (userData && animalData) {
        const adoption = await this.adoptionsRepository.create({
          userID: userData.id,
          animalID: animalData.id,
        });
        const adoptionData = await this.findById(adoption.dataValues.id);
        const { animal, user } = adoptionData.dataValues;
        this.mailsService.sendMails({
          petName:animal.dataValues.name, 
          username:user.dataValues.firstName,
          email:user.dataValues.email,
        },
        'ADOPT');
        return 'Adopted successfully';
      } else {
        throw new HttpException('User or animal not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Adoption failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id:string):Promise<any> {
    try {
      const adoption = await this.adoptionsRepository.findOne({
        where: {
          id: id,
        },
        include: [Animal, Users],
      });
      if (!adoption) throw new NotFoundException('Adoption not found');
      return adoption;
    } catch (error) {
      return error;
    }
  }
}
