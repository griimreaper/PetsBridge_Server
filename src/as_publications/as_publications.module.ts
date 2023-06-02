import { Module } from '@nestjs/common';
import { AsPublicationsService } from './as_publications.service';
import { AsPublicationProviders } from './providers/as_publications.providers';
import { AsPublicationsController } from './as_publications.controller';

@Module({
  providers: [AsPublicationsService, ...AsPublicationProviders],
  controllers: [AsPublicationsController],
})
export class AsPublicationsModule {}
