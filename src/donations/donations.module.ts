import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { donationsProviders } from './donations.provider';

@Module({
  providers: [DonationsService, ...donationsProviders],
  controllers: [DonationsController],
})
export class DonationsModule {}
