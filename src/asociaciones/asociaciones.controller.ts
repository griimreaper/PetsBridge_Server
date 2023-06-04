import { Body, Controller, Get, Param, Delete, Put, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file/multer.config';


@ApiBearerAuth()
@ApiTags('Asociaciones')
@Controller('asociaciones')
export class AsociacionesController {
  constructor(private readonly asociacionesService: AsociacionesService,
    private readonly fileService:FileService,
  ) { }

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
  @UseInterceptors(
    FileInterceptor('profilePic', multerConfig),
  )
  async updateAsociation(@Param('id') idAsociacion: string, @Body() body: CreateAsociacionDto, @UploadedFile() profilePic?: Express.Multer.File ) {
    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      return this.asociacionesService.update(idAsociacion, body, url);
    }
    return this.asociacionesService.update(idAsociacion, body);
  }
}
