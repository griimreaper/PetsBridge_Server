import { UserRole } from 'src/auth/dto/login.dto';
import { RedSocialDto } from './create-RedSocial.dto';

export class CreateAsociacionDto {
  id?: string;

  email: string;

  password: string;

  asociationName: string;

  img_profile?: string;

  date_created: Date;

  description: string;

  country: string;

  address:string;

  status: boolean;

  reds?: string;

  rol?: UserRole;
}