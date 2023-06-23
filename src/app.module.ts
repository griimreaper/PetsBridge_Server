import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { AnimalsModule } from './animals/animals.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './file/multer.config';
import { DatabaseModule } from './database/database.module';
import { PublicationsUsersModule } from './publications_users/publications_users.module';
import { DonationsModule } from './donations/donations.module';
import { AuthModule } from './auth/auth.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { StripeModule } from './stripe/stripe.module';
import { CorsMiddleware } from './constants/cors.middleware';
import { MailsModule } from './mails/mails.module';
import { ReviewsModule } from './reviews/reviews.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AsociacionesModule,
    AnimalsModule,
    FileModule,
    MulterModule.register(multerConfig),
    PublicationsUsersModule,
    DonationsModule,
    AdoptionsModule,
    AuthModule,
    StripeModule,
    MailsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const allowedOrigins = ['https://petbridge.vercel.app', 'https://pet-bridge-client.vercel.app', 'http://localhost:3000'];

    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
