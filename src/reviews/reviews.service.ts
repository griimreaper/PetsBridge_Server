import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './reviews.entity';
import { ReviewsDto } from './dto/reviews.dto';
import { ConditionalReviewsDto } from './dto/reviews.dto';
import { Users } from '../users/entity/users.entity';

@Injectable()
export class ReviewsService {
  constructor(@Inject('REVIEWS_REPOSITORY') private reviewsRepository: typeof Review) {}

  async review(review:ReviewsDto):Promise<Review | HttpException> {
    try {
      const newReview = await this.reviewsRepository.create({ ...review });
      if (newReview) throw new BadRequestException('No se encontró al usuario');

      return newReview;
    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }

  async editReview(id:string, newValues:ConditionalReviewsDto) {
    try {
      const review = await this.reviewsRepository.findByPk(id);
      if (review) throw new NotFoundException('No existe ese review');

      await review.update({ ...newValues }, {
        where:{
          id:id,
        },
      });

      const newReview = await this.reviewsRepository.findByPk(id);

      return newReview;

    } catch (error) {
      return new HttpException(error.message, error.status);
    }
    
  }

  async getAllReviews():Promise<Review[] | HttpException> {
    try {
      const allReviews = await this.reviewsRepository.findAll({ include: {
        model:Users,
        attributes:['firstName', 'lastName'],
      },
      });
      return allReviews;

    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }
}
