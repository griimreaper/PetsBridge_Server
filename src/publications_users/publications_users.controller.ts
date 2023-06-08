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
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { CreatePublicationsDto } from './dto/publications_users.dto';
import { multerConfig } from 'src/file/multer.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from 'src/coments/comments.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Publications } from './entity/publications_users.entity';

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

  @Post('/publication')
  @UseInterceptors(
    FilesInterceptor('file', undefined, multerConfig))
  async createPub(@Body() newUser: CreatePublicationsDto, @UploadedFiles() file: Express.Multer.File[]) {
    return this.publicatiosService.createPub(newUser, file);
  }

  @Post('/comment')
  async userComment(@Body() newComment: CreateCommentDto) {
    return this.publicatiosService.comment(newComment);
  }

  @Patch()
  async updateLikes(@Body() like: CreatePublicationsDto) {
    return this.publicatiosService.updateLike(like);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id') // actualizar publicacion (recibe un id y body)
  async updatePost(
  @GetUser() user: any,
    @Param('id') id: string,
    @Body() body: CreatePublicationsDto,
  ) {
    const publication: any = await this.publicatiosService.findOne(id);

    if (user.id !== publication[0].userId) throw new HttpException('Forbidden resource', 403);

    return this.publicatiosService.update(id, body);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.publicatiosService.delete(id);
  }
}
