import { Controller, Post, Body, Get, Param, Delete, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AsPublicationsService } from './as_publications.service';
import { AsPublicationDto } from './dto/as_publication.dto';
import { LikeDto } from './dto/likes_publications.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/file/multer.config';

@Controller('as-publications')
export class AsPublicationsController {
  constructor(private asPublicationsService: AsPublicationsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file', undefined, multerConfig))
  postAdoption(@Body() post: AsPublicationDto, @UploadedFiles() file:Express.Multer.File[]) {
    console.log(post, 'este es el post');
    return this.asPublicationsService.postAdoption(post, file);
  }

  @Put()
  likeOrDislike(@Body() like:LikeDto) {
    return this.asPublicationsService.giveLike(like);
  }

  @Get()
  getAllPosts() {
    return this.asPublicationsService.getAllPosts();
  }

  @Get('detail/:id')
  findPostByID(@Param('id') id:number) {
    return this.asPublicationsService.findPostByPK(id);
  }

  @Get(':id')
  getPosstByAs(@Param('id') id:string) {
    return this.asPublicationsService.getPostsByAso(id);
  }

  @Delete('delete/:id')
  deletePost(@Param('id') id:number) {
    return this.asPublicationsService.deletePublication(id);
  }
}
