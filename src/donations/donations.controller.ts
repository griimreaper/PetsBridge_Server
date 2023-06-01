import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Patch('update/:id') // actualizar publicacion (recibe un id y body)
  async updatePost(@Param('id') id: string, @Body() body: CreateDonationsDto) {
    return this.donationsService.update(id, body);
  }
}
