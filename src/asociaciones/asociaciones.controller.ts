import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { AsociacionesService } from './asociaciones.service';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileService } from '../file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { GetUser } from '../auth/decorator/get-user.decorator';

@ApiBearerAuth()
@ApiTags('Asociaciones')
@Controller('asociaciones')
export class AsociacionesController {
  constructor(
    private readonly asociacionesService: AsociacionesService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  searchByName(@Query('name') name: string) {
    return this.asociacionesService.filtName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.asociacionesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/datafake')
  getFakeData() {
    return this.asociacionesService.generateData();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') idAsociacion: string) {
    return this.asociacionesService.findOne(idAsociacion);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteById(@GetUser() user: any, @Param('id') idAsociacion: string) {
    if (user.sub !== idAsociacion) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    return this.asociacionesService.delete(idAsociacion);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('profilePic', multerConfig))
  async updateAsociation(
  @GetUser() user: any,
    @Param('id') idAsociacion: string,
    @Body() body: CreateAsociacionDto,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {
    if (user.sub !== idAsociacion) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      return this.asociacionesService.update(idAsociacion, body, url);
    }
    return this.asociacionesService.update(idAsociacion, body);
  }
}
