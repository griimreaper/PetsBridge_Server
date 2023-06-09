import { config } from 'dotenv';
config();

export const jwtConstanst = {
  secret: process.env.JWT_SECRET_KEY,
};

export const SKP = {
  K: process.env.FKP,
  F: process.env.FKP,
};

