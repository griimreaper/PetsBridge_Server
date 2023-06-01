import { Module } from '@nestjs/common';
import { AsociacionesController } from './asociaciones.controller';
import { AsociacionesService } from './asociaciones.service';
import { asociacionesProviders } from './providers/asociaciones.provider';

@Module({
  controllers: [AsociacionesController],
  providers: [
    AsociacionesService, 
    ...asociacionesProviders],
})
export class AsociacionesModule {}
