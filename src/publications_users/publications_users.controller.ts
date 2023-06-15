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

  @UseGuards(JwtAuthGuard)
  @Get(':id?')
  async getall(
  @GetUser() user: any,
    @Param('id') id: string,
  ) {
    if (id) {
      return this.publicationsService.findOne(id);
    }
    return this.publicationsService.findAll(user.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/publication')
  @UseInterceptors(
    FilesInterceptor('file', undefined, multerConfig))
  async createPub(
  @GetUser() user: any,
    @Body() newPub: CreatePublicationsDto,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    const returned = user.rol === 'fundation' ?
      this.publicationsService.createPub({ ...newPub, asocId: user.sub }, file)
      : this.publicationsService.createPub({ ...newPub, userId: user.sub }, file);
    return returned;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment')
  async userComment(
  @GetUser() user: any,
    @Body() newComment: CreateCommentDto,
  ) {
    const returned = user.rol === 'fundation' ?
      await this.publicationsService.comment({ ...newComment, asocId: user.sub })
      : await this.publicationsService.comment({ ...newComment, userId: user.sub });
    return returned;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/comment/:idComment')
  async updateComment(
  @GetUser() user: any,
    @Param('idComment') idComment: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.publicationsService.updateComment(user, idComment, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/comment/:idComment')
  async deleteComment(
  @GetUser() user: any,
    @Param('idComment') idComment: string,
  ) {
    return this.publicationsService.deleteComment(user, idComment);
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

    if (user.sub !== publication[0].userId && user.sub !== publication[0].asocId && user.rol !== 'admin')
      throw new HttpException('Forbidden resource', 403);

    return this.publicationsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(
  @GetUser() user: any,
    @Param('id') id: string,
  ) {
    const publication: any = await this.publicationsService.findOne(id);

    if (user.sub !== publication[0].userId && user.sub !== publication[0].asocId && user.rol !== 'admin')
      throw new HttpException('Forbidden resource', 403);

    return this.publicationsService.delete(id);
  }
}
