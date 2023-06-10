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
    let html;
    switch (topic) {
      case 'RESET_PASSWORD':
        html = await email.render('password/resetPassword', { username:data.firstName, token: data.reset });
        await transporter.sendMail({
          to:data.email,
          subject:'Cambio de contraseña',
          html:html,
        });
        break;
      case 'VERIFY_USER':
        html = await email.render('user/verifyUser', { username:data.firstName, link: `https://localhost:3001/${data.code}/${data.id}` });
        await transporter.sendMail({
          to:data.email,
          subject:'Verificación de correo electrónico',
          html:html,
        });
        break;
      default:
        return;
    }
  }
}