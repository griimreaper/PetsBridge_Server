/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@nestjs/common';
import { transporter, email } from 'src/config/mailer';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Injectable()
export class MailsService {
  constructor(private readonly configService:ConfigService) {}

  AppEmail = this.configService.get('APP_EMAIL');

  async sendMails(data, topic:string) {
    console.log(data);
    switch (topic) {
      case 'RESET_PASSWORD':
        const html = await email.render('password/resetPassword', { username:data.firstName, token: data.reset });
        await transporter.sendMail({
          to:data.email,
          subject:'Cambio de contraseña',
          html:html,
        });
        break;
      default:
        return;
    }
  }
}