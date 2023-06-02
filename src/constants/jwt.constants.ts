import { config } from 'dotenv';
config();

export const jwtConstanst = {
  secret: process.env.JWT_SECRET_KEY,
};