import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { Asociaciones } from './entity/asociaciones.entity';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';

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

  @Post()
  async post(@Body() body: CreateAsociacionDto) {
    return this.asociacionesService.create(body);
  }

  @Delete('delete/:id')
  async deleteById(@Param('id') idAsociacion: string) {
    return this.asociacionesService.delete(idAsociacion);
  }
}
