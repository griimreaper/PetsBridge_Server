export interface ReviewsDto {
  idUser? : string;

  idAsociacion?: string;

  review :  string;

  rate :  string;
}

export interface ConditionalReviewsDto {

  review? :  string;

  rate? :  string;
}
