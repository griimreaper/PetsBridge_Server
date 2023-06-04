import { Module } from '@nestjs/common';
import { AsPublicationsService } from './as_publications.service';
import { AsPublicationProviders } from './providers/as_publications.providers';
import { AsPublicationsController } from './as_publications.controller';
import { FileService } from 'src/file/file.service';

@Module({
  providers: [AsPublicationsService, ...AsPublicationProviders, FileService],
  controllers: [AsPublicationsController],
})
export class AsPublicationsModule {}
