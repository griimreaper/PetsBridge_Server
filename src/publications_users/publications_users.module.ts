import { Module } from '@nestjs/common';
import { PublicationsUsersService } from './publications_users.service';
import { PublicationsUsersController } from './publications_users.controller';
import { publicationsProviders } from './publications_users.provider';

@Module({
  providers: [PublicationsUsersService, ...publicationsProviders],
  controllers: [PublicationsUsersController],
})
export class PublicationsUsersModule {}
