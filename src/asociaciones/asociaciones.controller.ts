import { Body, Controller, Get, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiBearerAuth()
@ApiTags('Asociaciones')
@Controller('asociaciones')
export class AsociacionesController {
  constructor(private readonly asociacionesService: AsociacionesService) { }

  @Get()
  async getAll() {
    return this.asociacionesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') idAsociacion: string) {
    return this.asociacionesService.findOne(idAsociacion);
  }

  @Delete('delete/:id')
  async deleteById(@Param('id') idAsociacion: string) {
    return this.asociacionesService.delete(idAsociacion);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateAsociation(@Param('id') idAsociacion: string, @Body() body: CreateAsociacionDto) {
    return this.asociacionesService.update(idAsociacion, body);
  }
}
