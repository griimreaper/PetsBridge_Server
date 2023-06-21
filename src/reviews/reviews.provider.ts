import { Review } from './reviews.entity';

export const reviewsProviders = [{
  provide:'REVIEWS_REPOSITORY',
  useValue:Review,
}];