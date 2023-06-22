import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { FileService } from '../file/file.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ChangeEmailDto, ChangePasswordDto } from './dto/changeLoginData';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService,
    private fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  searchByName(
  @GetUser() user: any,
    @Query('name') name: string,
  ) {
    return this.usersService.filtName(name, user.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(
  @GetUser() user: any,
  ) {
    return this.usersService.findAll(user.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(
  @GetUser() user: any,
    @Param('id') id: string,
  ) {
    if (user.sub !== id && user.rol !== 'admin') throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('profilePic', multerConfig),
  )
  async updateUser(
  @GetUser() user: any,
    @Param('id') id: string,
    @Body() body: CreateUserDto,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {

    if (user.sub !== id && user.rol !== 'admin') return { resp: 'Forbidden resource', status: HttpStatus.FORBIDDEN };

    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      return this.usersService.update(id, body, user.rol, url);
    }
    return this.usersService.update(id, body, user.rol);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Body() changePasswordto:ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-email')
  async changeEmail(@Body() body:ChangeEmailDto) {
    return this.usersService.changeEmail(body);
  }
}
