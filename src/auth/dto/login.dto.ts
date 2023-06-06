export enum UserRole {
  USER = 'user',
  FUNDATION = 'fundation',
}

export class LoginDto {
  email: string;

  password: string;

  rol?: UserRole;

  asociationName: string;
}