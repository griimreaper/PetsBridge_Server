import { UserRole } from 'src/auth/dto/login.dto';
export class CreateUserDto {
  id: number;

  first_Name: string;

  last_Name: string;

  email: string;

  password: string;

  img_profile: string;

  country: string;

  phone: number;

  isGoogle: boolean;

  status: boolean;
  
  rol?: UserRole;
}
