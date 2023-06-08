import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/mailer';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class MailsService {
  constructor(private readonly configService:ConfigService) {}

  AppEmail = this.configService.get('APP_EMAIL');

  async sendMails(user:Users, topic:string) {

    switch (topic) {
      case 'RESET_PASSWORD':
        const info = await transporter.sendMail({
          from: this.AppEmail, // sender address
          to: user.email, // list of receivers
          subject: 'Cambio de contraseña', // Subject line
          // eslint-disable-next-line @typescript-eslint/quotes
          html: `<h1>¡Hola ${user.firstName}!</h1> 
          <p>Usa el siguiente token para crear una nueva <br/> contraseña:</p>
          <p>${user.reset}</p><br/><br/> <p>Este token expirará en diez minutos.</p><p>Do not reply</p>`, // html body
        });
    }
    
  }
}
