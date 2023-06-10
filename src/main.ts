import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { CORS } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const port = process.env.SERVER_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  //Configuring pug for email templates
  /* Telling nest we will use ../public folder for storing static assets (e.g. images) */
  app.useStaticAssets(join(__dirname, '..', 'public'));
  /* Telling nest we will use ../views folder for storing templates */
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  /* Telling nest we will use 'pug' as our template engine*/
  app.setViewEngine('pug');


  await app.listen(port);
  console.log(`Application running on: ${port}`);
}
bootstrap();
