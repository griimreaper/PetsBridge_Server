import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConditionalReviewsDto, ReviewsDto } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService:ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  review(@Body() newReview:ReviewsDto) {
    return this.reviewsService.review(newReview);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  editReview(@Param('id') id:string, @Body() newValues:ConditionalReviewsDto) {
    return this.reviewsService.editReview(id, newValues);
  }

  @Get()
  getReviews() {
    return this.reviewsService.getAllReviews();
  }
}
