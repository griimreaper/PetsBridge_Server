import { UserRole } from 'src/auth/dto/login.dto';
export class CreateUserDto {
  id: number;

  first_Name: string;

  last_Name: string;

  email: string;

  password: string;

  profilePic: string;

  country: string;

  phone: number;

  isGoogle: boolean;

  isActive: boolean;

  rol?: UserRole;
}
