import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.provider';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, FileService],
  exports: [UsersService],
})
export class UsersModule {}
