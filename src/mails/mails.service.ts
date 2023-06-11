/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@nestjs/common';
import { transporter, templates } from 'src/config/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  constructor(private readonly configService:ConfigService) {}

  AppEmail = this.configService.get('APP_EMAIL');

  async sendMails(data, topic:string) {
    let html;
    switch (topic) {
      case 'RESET_PASSWORD':
        const codes = data.reset.split('.');
        html = await templates.resetPassword({
          username: data.firstName ? data.firstName : data.nameOfFoundation, 
          token:data.reset,
        });
        transporter.sendMail({
          to: data.email,
          subject: 'Cambio de contraseña',
          html: html,
        });
        break;
      case 'VERIFY_USER':
        html = await templates.verifyUser({
          username:data.firstName ? data.firstName : data.nameOfFoundation,
          link: `https://localhost:3001/${data.code}/${data.id}`,
        });
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