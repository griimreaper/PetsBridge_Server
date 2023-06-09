/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@nestjs/common';
import { transporter } from 'src/config/mailer';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { mailConstants } from 'src/constants/mail.constants';

@Injectable()
export class MailsService {
  constructor(private readonly configService:ConfigService) {}

  AppEmail = this.configService.get('APP_EMAIL');

  async sendMails(data, topic:string) {

    switch (topic) {
      //When reset Password
      case 'RESET_PASSWORD':
        await transporter.sendMail({
          from: this.AppEmail, // sender address
          to: data.email, // list of receivers
          subject: 'Cambio de contraseña', // Subject line
          text:`¡Saludos!</n>
           Usa el siguiente token para crear una nueva </n> contraseña: </n>
           ${data.reset} </n>
           No responda a este remitente.</n>
           Att: Equipo de PetsBridge.
          `,
          html: `
          <body style='font-family: ‘Roboto’, Helvetica, Arial, sans-serif; text-align:center;'>
            <h1 style='color:purple; background-color:yellow;'>¡Saludos!</h1> 
              <p>Usa el siguiente token para crear una nueva <br/> contraseña:</p>
              <p style='background-color:gray;'>${data.reset}</p><br/><br/>
              <footer style='text-align:left;'>
              <p>No responda a este remitente.</p>
              <p>Att: Equipo de <b><i>PetsBridge</i></b></p>
              </footer>
          </body>`, // html body
        });
        break;

        //When register
      case 'REGISTER':
        await transporter.sendMail({
          from: this.AppEmail, // sender address
          to: data.email, // list of receivers
          subject: 'Verificación', // Subject line
          text:`¡Saludos!</n>
             Muchas gracias por elegir ser parte de nuestra comunidad</n>
             Pero antes que nada, verifiquemos tu cuenta.</n>
             Copia y pega la siguiente url en tu navegador</n>
             ${mailConstants.verificationLink}${data.code}/${data.id}</n>
             No responda a este remitente.</n>
             Att: Equipo de PetsBridge.
            `,
          html: `
            <body style='font-family: ‘Roboto’, Helvetica, Arial, sans-serif; text-align:center;'>
              <h1 style='color:purple; background-color:yellow;'>¡Saludos!</h1> 
                <p>Muchas gracias por elegir ser parte de nuestra comunidad</p>
                <p>Pero antes que nada, verifiquemos tu cuenta haciendo click en el siguiente enlace.</p>

                <a style='background-color:gray;' href=${mailConstants.verificationLink}${data.code}/${data.id}>
                Link de verificación
                </a>

                <br/>
                <br/>
                <footer style='text-align:left;'>
                <p>No responda a este remitente.</p>
                <p>Att: Equipo de <b><i>PetsBridge</i></b></p>
                </footer>
            </body>`, // html body
        });
        break;
    }
    
  }
}
