import { UserRole } from '../../auth/dto/login.dto';
export class CreateUserDto {
  id?: number;

  firstName?: string;

  lastName?: string;

  email: string;

  password?: string;

  image?: string;

  country?: string;

  phone?: number;

  isGoogle: boolean;

  isActive: boolean;

  rol: UserRole;
}
