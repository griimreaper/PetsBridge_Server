import { Injectable, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Adoption } from './adoptions.entity';
import { AdoptionDto } from './dto/adoptions.dto';
import { Users } from '../users/entity/users.entity';
import { Animal } from '../animals/animals.entity';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class AdoptionsService {
  constructor(
    @Inject('ADOPTIONS_REPOSITORY') private readonly adoptionsRepository: typeof Adoption,
    @Inject('USERS_REPOSITORY') private readonly usersRepository: typeof Users,
    @Inject('ANIMALS_REPOSITORY') private readonly animalsRepository: typeof Animal,
    private readonly mailsService:MailsService,
  ) {}

  async pending(id: string, user: any): Promise<string> {
    try {
      const userData = await this.usersRepository.findByPk(user.sub);
      const animalData = await this.animalsRepository.findByPk(id);
      if (userData && animalData) {
        const adoption = await this.adoptionsRepository.findOne({ where: { animalID: id } });
        if (adoption && adoption.userID === user.sub) throw new HttpException('This adoption is already pending.', 400);
        await this.adoptionsRepository.create({
          userID: userData.id,
          animalID: animalData.id,
          status: 'pending',
        });
        animalData.status = 'pending';
        await animalData.save();
        return 'Adopted pending';
      } else {
        throw new HttpException('User or animal not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
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

  async adopt(id: string, asoc: any): Promise<string> {
    try {
      const adoptionData = await this.findById(id);
      const animalData = await this.animalsRepository.findByPk(adoptionData.animalID);
      if (animalData.as_id !== asoc.sub) throw new Error();
      adoptionData.status = 'adopted';
      await adoptionData.save();
      animalData.status = 'adopted';
      await animalData.save();
      const { animal, user } = adoptionData.dataValues;
      this.mailsService.sendMails({
        petName:animal.dataValues.name,
        sername:user.dataValues.firstName,
        email:user.dataValues.email,
      },
      'ADOPT');
      return 'Adoption Realized.';
    } catch (error) {
      throw new HttpException('Adoption failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAdoptions(): Promise<AdoptionDto[]> {
    return this.adoptionsRepository.findAll();
  }
}
