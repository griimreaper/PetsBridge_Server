import { UserRole } from 'src/auth/dto/login.dto';
import { RedSocialDto } from './create-RedSocial.dto';

export class CreateAsociacionDto {
  id?: string;

  email: string;

  password: string;

  nameOfFoundation: string;

  profilePic?: string;

  phone: string;

  dateStart: Date;

  description: string;

  country: string;

  address:string;

  status: boolean;

  reds?: string;

  rol?: UserRole;
}