import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { reviewsProviders } from './reviews.provider';
import { UsersModule } from '../users/users.module';
import { ReviewsController } from './reviews.controller';
import { AsociacionesModule } from 'src/asociaciones/asociaciones.module';

@Module({
  imports:[UsersModule, AsociacionesModule],
  providers: [ReviewsService, ...reviewsProviders ],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
