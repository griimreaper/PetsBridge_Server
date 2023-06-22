import { config } from 'dotenv';
config();

export const jwtConstanst = {
  secret: process.env.JWT_SECRET_KEY,
};

export const SKP = {
  K: process.env.SKP,
  F: process.env.FKP,
};

export const Google = {
  Id: process.env.GOOGLE_ID,
  Secret: process.env.GOOGLE_SECRET,
};