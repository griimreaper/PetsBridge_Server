import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Google } from 'src/constants/jwt.constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: Google.Id,
      clientSecret: Google.Secret,
      callbackURL: 'https://petbridge.vercel.app/home',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void> {
    console.log(accessToken, 'accesToken');
    console.log(refreshToken, 'refreshToken');
    console.log(profile, 'profile');
    console.log(done, 'done');
    done(null, profile);
  }
}