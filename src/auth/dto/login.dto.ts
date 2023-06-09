export enum UserRole {
  USER = 'user',
  FUNDATION = 'fundation',
  ADMIN = 'admin',
}

export class LoginDto {
  email: string;

  password: string;

  rol?: UserRole;
  
  name?: string;
}