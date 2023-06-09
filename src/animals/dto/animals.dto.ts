export enum AnimaleGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AnimalSpecie {
  DOG = 'perro',
  CAT = 'gato',
  ROEDOR = 'roedor',
  AVE = 'ave',
  OTRO = '',
}

export interface AnimalDto {
  userId?:string,
  name:string,
  specie:AnimalSpecie,
  gender:AnimaleGender,
  as_id:string,
  description:string,
  country: string,
  state: string,
  city: string,
  weight?: string,
  age_M?: number,
  age_Y?: number,
}