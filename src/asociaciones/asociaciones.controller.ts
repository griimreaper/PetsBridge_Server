import { Body, Controller, Get, Param, Post, Delete, Put, Res, HttpStatus } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { Response } from 'express';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

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

  @Get('email/:email')
  async getByEmail(@Param() email:string, @Res() response: Response ) {
    const resp = this.asociacionesService.findOne(email);
    response.status(HttpStatus.OK).json({ resp: resp });
  }

  @Post()
  async post(@Body() body: CreateAsociacionDto, @Res() response: Response) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const resp = await this.asociacionesService.create({ ...body, password: hashedPassword });
      switch (resp.status) {
        case HttpStatus.CREATED:
          response.status(HttpStatus.CREATED).send(resp.send);
          break;
        case HttpStatus.BAD_REQUEST:
          response.status(HttpStatus.BAD_REQUEST).send(resp.send);
          break;
      }
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }

  }

  @Delete('delete/:id')
  async deleteById(@Param('id') idAsociacion: string) {
    return this.asociacionesService.delete(idAsociacion);
  }

  @Put('update/:id')
  async updateAsociation(@Param('id') idAsociacion: string, @Body() body: CreateAsociacionDto) {
    return this.asociacionesService.update(idAsociacion, body);
  }
}
