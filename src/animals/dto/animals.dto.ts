export enum AnimaleGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface AnimalDto {
  userId?:string,
  name:string,
  specie:string,
  gender:AnimaleGender,
  as_id:string,
  description:string,
  country: string,
  state: string,
  city: string,
  weight?: string,
  age_M?: string,
  age_Y?: string,
  email: string,
  phone: string,
  urlContac: string,
}