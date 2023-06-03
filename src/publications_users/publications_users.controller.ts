import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
  Query,
} from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { CreatePublicationsDto } from './dto/publications_users.dto';
import { multerConfig } from 'src/file/multer.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Publications_user')
@Controller('publications_user')
export class PublicationsUsersController {
  constructor(private readonly publicatiosService: PublicationsUsersService) {}

  @Get(':id?')
  async getall(@Param('id') id: string) {
    if (id) {
      return this.publicatiosService.findOne(id);
    }
    return this.publicatiosService.findAll();
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('file', undefined, multerConfig))
  async createUser(@Body() newUser: CreatePublicationsDto, @UploadedFiles() file: Express.Multer.File[]) {
    console.log(newUser, 'AVERIGUANDO DATOOOSSS');
    return this.publicatiosService.createUser(newUser, file);
  }

  @Patch()
  async updateLikes(@Body() like: CreatePublicationsDto) {
    return this.publicatiosService.updateLike(like);
  }

  @Patch('update/:id') // actualizar publicacion (recibe un id y body)
  async updatePost(
  @Param('id') id: string,
    @Body() body: CreatePublicationsDto,
  ) {
    return this.publicatiosService.update(id, body);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.publicatiosService.delete(id);
  }
}
