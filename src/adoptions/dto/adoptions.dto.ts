// eslint-disable-next-line import/no-extraneous-dependencies
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AdoptionDto {
  @IsNotEmpty()
  @IsUUID('all')
    animalID: string;

  @IsNotEmpty()
  @IsUUID('all')
    userID: string;
}