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
import { multerConfig } from '../file/multer.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '../coments/comments.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Publications_user')
@Controller('publications_user')
export class PublicationsUsersController {
  constructor(private readonly publicationsService: PublicationsUsersService) {}

  @Get(':id?')
  async getall(@Param('id') id: string) {
    
    if (id) {
      return this.publicationsService.findOne(id);
    }
    return this.publicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/publication')
  @UseInterceptors(
    FilesInterceptor('file', undefined, multerConfig))
  async createPub(@Body() newUser: CreatePublicationsDto, @UploadedFiles() file: Express.Multer.File[]) {
    return this.publicationsService.createPub(newUser, file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment')
  async userComment(
  @Body() newComment: CreateCommentDto) {
    return this.publicationsService.comment(newComment);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/comment/:idComment')
  async updateComment(
  @GetUser() user: any,
    @Param('idComment') idComment: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.publicationsService.updateComment(user.id, idComment, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:idComment')
  async deleteComment(
  @GetUser() user: any,
    @Param('idComment') idComment: string,
  ) {
    return this.publicationsService.deleteComment(user.id, idComment);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateLikes(@Body() like: CreatePublicationsDto) {
    return this.publicationsService.updateLike(like);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id') // actualizar publicacion (recibe un id y body)
  async updatePost(
  @GetUser() user: any,
    @Param('id') id: string,
    @Body() body: CreatePublicationsDto,
  ) {
    const publication: any = await this.publicationsService.findOne(id);

    if (user.id !== publication[0].userId) throw new HttpException('Forbidden resource', 403);

    return this.publicationsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(
  @GetUser() user: any,
    @Param('id') id: string,
  ) {
    const publication: any = await this.publicationsService.findOne(id);

    if (user.id !== publication[0].userId) throw new HttpException('Forbidden resource', 403);

    return this.publicationsService.delete(id);
  }
}
