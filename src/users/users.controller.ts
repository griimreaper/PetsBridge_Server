import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
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

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updatePost(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.usersService.update(id, body);
  }
}
