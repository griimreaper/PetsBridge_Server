import { UserRole } from 'src/auth/dto/login.dto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IsEmail, IsMobilePhone, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';

export class CreateAsociacionDto {

  @IsEmail()
    email: string;

  @IsStrongPassword({
    minLength:8,
    minUppercase:1,
    minNumbers:1,
    minSymbols:1,
  })
    password: string;

  @IsNotEmpty()
  @MinLength(5)
    nameOfFoundation: string;

  profilePic?: string;

  phone: string;

  dateStart: Date;

  description: string;

  country: string;

  address:string;

  isActive: boolean;

  reds?: string;

  rol?: UserRole;
}