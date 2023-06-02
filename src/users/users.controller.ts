import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  // @Post()
  // async createUser(@Body() newUser: CreateUserDto) {
  //   return this.usersService.createUser(newUser);
  // }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch('update/:id')
  async updatePost(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.usersService.update(id, body);
  }
}
