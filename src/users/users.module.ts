import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.provider';
import { FileService } from '../file/file.service';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports:[MailsModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, FileService],
  exports: [UsersService],
})
export class UsersModule {}
