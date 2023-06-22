import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './reviews.entity';
import { ReviewsDto } from './dto/reviews.dto';
import { ConditionalReviewsDto } from './dto/reviews.dto';
import { UsersService } from '../users/users.service';
import { Users } from '../users/entity/users.entity';
import { AsociacionesService } from '../asociaciones/asociaciones.service';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('REVIEWS_REPOSITORY') private reviewsRepository: typeof Review,
    private usersService:UsersService,
    private asociacionesService: AsociacionesService,
  ) {}

  async review(review:ReviewsDto):Promise<Review | HttpException> {
    try {
      const { idUser, idAsociacion } = review;
      let user;
      let asociacion;

      try {
        user = await this.usersService.findById(idUser);
      } catch (error) {
        console.log(error.message);
      }
      
      try {
        asociacion = await this.asociacionesService.findOne(idAsociacion);
      } catch (error) {
        console.log(error.message);
      }
  
      if (!user && !asociacion) throw new NotFoundException('No se encontró al usuari');

      const newReview = await this.reviewsRepository.create({ ...review });
      if (!newReview) throw new BadRequestException('Algo salió mal');

      return newReview;
    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }

  async editReview(id:string, newValues:ConditionalReviewsDto) {
    try {
      const review = await this.reviewsRepository.findByPk(id);
      if (!review) throw new NotFoundException('No existe ese review');

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
      const allReviews = await this.reviewsRepository.findAll({ include: [{
        model:Users,
        attributes:['firstName', 'lastName', 'image'],
      },
      {
        model:Asociaciones,
        attributes:['nameOfFoundation', 'image'],
      },
      ],
      });
      return allReviews;

    } catch (error) {
      return new HttpException(error.message, error.status);
    }
  }
}
