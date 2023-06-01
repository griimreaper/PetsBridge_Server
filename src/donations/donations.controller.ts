import { Body, Controller, Get, Post } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationsDto } from './dto/donations.dto';

@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Get()
  getAllDonations() {
    return this.donationsService.findAll();
  }

  @Post()
  async createUser(@Body() newUser: CreateDonationsDto) {
    return this.donationsService.createUser(newUser);
  }
}
