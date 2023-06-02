import { Module } from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { PublicationsUsersController } from './publications_users.controller';
import { publicationsProviders } from './publications_users.provider';
import { FileService } from 'src/file/file.service';

@Module({
  providers: [PublicationsUsersService, ...publicationsProviders, FileService],
  controllers: [PublicationsUsersController],
})
export class PublicationsUsersModule {}
