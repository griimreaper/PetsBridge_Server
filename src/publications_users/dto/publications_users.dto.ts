export class CreatePublicationsDto {
  id?: string;

  userId?: string;

  title: string;

  description: string;

  isActive?: boolean;

  imagen?: string[] | string;

  datePublication?: Date;
}
