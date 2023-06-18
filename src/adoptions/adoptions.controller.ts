import { Controller, Post, Body, UseGuards, Get, HttpException, Param } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@ApiTags('Adoptions')
@Controller('adoptions')
export class AdoptionsController {
  constructor(private adoptionsService:AdoptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAdoptions() {
    try {
      return this.adoptionsService.getAdoptions();
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':idAdoption')
  async findByID(@Param('idAdoption') id: string) {
    return this.adoptionsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pending/:idAnimal')
  pendingPet(
  @GetUser() user: any,
    @Param('idAnimal') id: string,
  ) {
    return this.adoptionsService.pending(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('adopted/:idAdoption')
  adoptPet(
  @GetUser() user: any,
    @Param('idAdoption') id: string,
  ) {
    if (user.rol !== 'fundation') throw new HttpException('Forbidden resource', 403);
    return this.adoptionsService.adopt(id, user);
  }
}
