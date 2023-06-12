// eslint-disable-next-line import/no-extraneous-dependencies
import { IsNotEmpty, IsUUID } from 'class-validator';

export enum AnimaleGender {
  MALE = 'male',
  FEMALE = 'female',
}

export class AnimalDto {
  @IsUUID('all')
    userId?:string;

  @IsNotEmpty()
    name:string;
  
  specie:string;
  
  gender:AnimaleGender;
  
  @IsUUID('all')
    as_id:string;
  
  @IsNotEmpty()
    description:string;
  
  @IsNotEmpty()
    country: string;
  
  @IsNotEmpty()
    state: string;
  
  @IsNotEmpty()
    city: string;
  
  @IsNotEmpty()
    weight?: string;
  
  @IsNotEmpty()
    age_M?: string;

  @IsNotEmpty()
    age_Y?: string;
}