export class CreatePublicationsDto {
  id?: number;

  userId: number;

  title: string;

  description: string;

  isActive?: boolean;

  //   image?: string[];

  datePublication: Date;
}
