import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { donationsProviders } from 'src/donations/donations.provider';

@Module({
  controllers: [StripeController],
  providers: [StripeService, ...donationsProviders],
})
export class StripeModule {}
