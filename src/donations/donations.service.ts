import { Inject, Injectable } from '@nestjs/common';
import { Donations } from './entity/donations.entity';
import { CreateDonationsDto } from './dto/donations.dto';

@Injectable()
export class DonationsService {
  constructor(
    @Inject('DONATIONS_REPOSITORY')
    private donationsService: typeof Donations,
  ) {}

  async findAll(): Promise<Donations[]> {
    const donations = await this.donationsService.findAll();
    return donations;
  }

  async createUser(createUserDto: CreateDonationsDto) {
    try {
      const newUser = await this.donationsService.create({
        ...createUserDto,
      });
      return newUser;
    } catch (error) {
      throw new Error(
        `Error al intentar crear una nueva donacion: ${error.message}`,
      );
    }
  }
}
