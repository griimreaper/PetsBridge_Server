import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../file/multer.config';
import { FileService } from '../file/file.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AcountAccess } from '../auth/guards/acountAccess.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService,
    private fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AcountAccess)
  @Delete(':id')
  async deleteById(
  @GetUser() user: any,
    @Param('id') id: string,
  ) {
    if (user.sub !== id) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    return this.usersService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AcountAccess)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('profilePic', multerConfig))
  async updateUser(@Param('id') id: string, @Body() body: CreateUserDto, @UploadedFile() profilePic?: Express.Multer.File,
  ) {
<<<<<<< HEAD
    return this.usersService.update(id, body, profilePic);
=======
    if (user.sub !== id) return { resp: 'Forbidden resource', status: HttpStatus.FORBIDDEN };
    if (profilePic) {
      const url = await this.fileService.createFiles(profilePic);
      return this.usersService.update(id, body, url);
    }
    return this.usersService.update(id, body);
>>>>>>> d5dae11aac987eadca5697a8b732c2a837a5eaf9
  }
}
