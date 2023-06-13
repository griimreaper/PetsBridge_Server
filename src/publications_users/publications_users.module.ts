import { Module } from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { PublicationsUsersController } from './publications_users.controller';
import { publicationsProviders } from './publications_users.provider';
import { FileService } from '../file/file.service';
import { comentsProvider } from '../coments/comments.providers';

@Module({
  providers: [PublicationsUsersService, ...publicationsProviders, FileService, ...comentsProvider],
  controllers: [PublicationsUsersController],
})
export class PublicationsUsersModule {}
