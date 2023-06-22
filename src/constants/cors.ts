import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: 'https://petbridge.vercel.app', // o tu lista de orígenes permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
};