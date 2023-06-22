export enum UserRole {
  USER = 'user',
  FUNDATION = 'fundation',
  ADMIN = 'admin',
}

export class RegisterDto {
  email: string;

  password: string;

  rol?: UserRole;

  firstName?: string;

  lastName?: string;

  nameOfFoundation?: string;

  confirmPassword?: string;

  country?: string;

  phone?: string;

  address?: string;

  dateStart?: string;

  description?: string;

  image?: string;
}

export class LoginDto {
  email: string;

  password?: string;

  google: boolean;

  firstName?: string;

  image?: string;
}
