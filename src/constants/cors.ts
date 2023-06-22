import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: ['https://pet-bridge.vercel.app', 'http://localhost:3000', 'https://petbridge.vercel.app', 'https://petbridge.vercel.app/'], // o tu lista de orígenes permitidos
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type,Authorization'],
};