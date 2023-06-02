import { UserRole } from 'src/auth/dto/login.dto';

export class CreateAsociacionDto {
  id?: string;

  email: string;

  password: string;

  name: string;

  img_profile: string;

  date_created: Date;

  description: string;

  country: string;

  address:string;

  status: boolean;

  rol?: UserRole;
}