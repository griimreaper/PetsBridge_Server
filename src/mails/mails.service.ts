/* eslint-disable @typescript-eslint/quotes */
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
          text:`¡Hola ${user.firstName}!</n>
           Usa el siguiente token para crear una nueva </n> contraseña: </n>
           ${user.reset} </n>
           Este token expirará en diez minutos.</n>
           No responda a este remitente.</n>
           Att: Equipo de PetsBridge.
          `,
          html: `
          <body style='font-family: ‘Roboto’, Helvetica, Arial, sans-serif; text-align:center;'>
            <h1 style='color:purple; background-color:yellow;'>¡Hola ${user.firstName}!</h1> 
              <p>Usa el siguiente token para crear una nueva <br/> contraseña:</p>
              <p style='background-color:gray;'>${user.reset}</p><br/><br/> <p>Este token expirará en diez minutos.</p>
              <footer style='text-align:left;'>
              <p>No responda a este remitente.</p>
              <p>Att: Equipo de <b><i>PetsBridge</i></b></p>
              </footer>
          </body>`, // html body
        });
    }
    
  }
}
