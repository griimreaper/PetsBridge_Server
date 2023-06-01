import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { CreatePublicationsDto } from './dto/publications_users.dto';

@Controller('publications')
export class PublicationsUsersController {
  constructor(private readonly publicatiosService: PublicationsUsersService) {}

  @Get()
  async getall() {
    return this.publicatiosService.findAll();
  }

  @Post()
  async createUser(@Body() newUser: CreatePublicationsDto) {
    return this.publicatiosService.createUser(newUser);
  }

  @Patch('update/:id') // actualizar publicacion (recibe un id y body)
  async updatePost(
    @Param('id') id: string,
    @Body() body: CreatePublicationsDto,
  ) {
    return this.publicatiosService.update(id, body);
  }
}
