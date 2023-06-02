import { UserRole } from 'src/auth/dto/login.dto';
export class CreateUserDto {
  id: number;

  password: string;

  email: string;

  first_Name: string;

  last_Name: string;

  imgProf: string;

  status: boolean;

  phone: number;

  isGoogle: boolean;
  
  rol?: UserRole;
}
