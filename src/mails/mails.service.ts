/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@nestjs/common';
import { transporter, templates } from '../config/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  constructor(private readonly configService:ConfigService) {}

  async sendMails(data, topic:string) {
    let html;
    switch (topic) {
      case 'RESET_PASSWORD':
        html = await templates.resetPassword({
          username: data.firstName ? data.firstName : data.nameOfFoundation,
          token:data.reset,
        });
        transporter.sendMail({
          to: data.email,
          subject: 'Cambio de contraseña.',
          html: html,
        });
        break;
      case 'VERIFY_USER':
        html = await templates.verifyUser({
          username:data.firstName ? data.firstName : data.nameOfFoundation,
          link: `http://localhost:3001/verification/${data.code}/${data.id}`, // para el deploy https://petbridge-8ia1vktc5-maxihorta.vercel.app/${data.code}/${data.id}
        });
        await transporter.sendMail({
          to:data.email,
          subject:'Verificación de correo electrónico.',
          html:html,
        });
        break;
      case 'ADOPT':
        html = await templates.adoptPet({
          username: data.username,
          petName: data.petName,
        });
        await transporter.sendMail({
          to:data.email,
          subject:'Hiciste una adopción.',
          html:html,
        });
        break;
      case "DONATE":
        //console.log(data);
        html = await templates.donate({
          Asociacion:data.asociacion,
          Fecha:data.donation.createdAt,
          Monto:data.donation.mount,
          Donacion:data.donation.paymentId,
        });
        await transporter.sendMail({
          to:data.donation.email,
          subject:'Agradecimiento.',
          html:html,
        });
      default:
        return;
    }
  }
}