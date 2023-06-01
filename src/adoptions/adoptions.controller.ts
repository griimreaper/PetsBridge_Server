import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionDto } from './dto/adoptions.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private adoptionsService:AdoptionsService) {}

  @Post()
  adoptPet(@Body() IDS:AdoptionDto) {
    return this.adoptionsService.adopt(IDS);
  }

  @Get()
  findAdoptions() {
    return this.adoptionsService.findAdoptions();
  }
}
