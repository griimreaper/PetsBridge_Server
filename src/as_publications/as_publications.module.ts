import { Module } from '@nestjs/common';
import { AsPublicationsService } from './as_publications.service';
import { AsPublicationProviders } from './providers/as_publications.providers';

@Module({
  providers: [AsPublicationsService, ...AsPublicationProviders],
})
export class AsPublicationsModule {}
