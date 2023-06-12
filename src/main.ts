import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { CORS } from './constants';
const port = process.env.SERVER_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('PetsBridge')
    .setDescription('Peticiones')
    .setVersion('1.0')
    .build();

  app.use(morgan('dev'));

  app.enableCors(CORS);

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter:true,
      showRequestDuration: true,
    },
  });


  await app.listen(port);
  console.log(`Application running on: ${port}`);
}
bootstrap();
