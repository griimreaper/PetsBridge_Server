export interface ReviewsDto {
  id_user : string;

  review :  string;

  rate :  string;
}

export interface ConditionalReviewsDto {
  id_user? : string;

  review? :  string;

  rate? :  string;
}
