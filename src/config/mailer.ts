// eslint-disable-next-line import/no-extraneous-dependencies
import pug = require('pug');
import nodemailer = require('nodemailer');
import * as dotenv from 'dotenv';

dotenv.config();
const { APP_EMAIL, APP_PASSWORD } = process.env;

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: APP_EMAIL, // generated ethereal user
    pass: APP_PASSWORD, // generated ethereal password
  },
  from:APP_EMAIL,
});
transporter.verify().then(() => {
  console.log('Server is ready to take our messages');
}).catch(error => console.log(error));

//Compilers
export const templates = {
  resetPassword: pug.compileFile('views/password/resetPassword.pug'),
  verifyUser: pug.compileFile('views/user/verifyUser.pug'),
  adoptPet: pug.compileFile('views/adoption/adopt.pug'),
};