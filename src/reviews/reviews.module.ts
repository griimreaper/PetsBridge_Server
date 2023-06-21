import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { reviewsProviders } from './reviews.provider';

@Module({
  providers: [ReviewsService, ...reviewsProviders ],
})
export class ReviewsModule {}
