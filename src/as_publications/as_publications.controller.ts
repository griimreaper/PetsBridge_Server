import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AsPublicationsService } from './as_publications.service';
import { AsPublicationDto } from './dto/as_publication.dto';

@Controller('as-publications')
export class AsPublicationsController {
  constructor(private asPublicationsService: AsPublicationsService) {}

  @Post()
  postAdoption(@Body() post: AsPublicationDto) {
    return this.asPublicationsService.postAdoption(post);
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
