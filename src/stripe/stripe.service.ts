import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { v4 as uuid } from 'uuid';
import { DonationsPay } from './dto/donationsPay.dto';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.API_SECRET_STRIPE, {
      apiVersion: '2022-11-15',
    });
  }


  async createPrueba(body: DonationsPay): Promise<string> {
    const data: Promise<string> = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Dotations',
              description: 'Donations a la caridad',
            },
            currency: 'usd',
            unit_amount: body.donation,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/success',
      cancel_url: 'http://localhost:3001/cancel',
    });
    return data;
  }

}
// async createDonationSession(): Promise<any> {
//   const session = await this.stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'Donation', // Nombre de la donación
//           },
//           unit_amount: 1000, // Monto en centavos (ejemplo: $10.00)
//         },
//         quantity: 1, // Cantidad de donaciones
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:3001/success', // URL de éxito de donación
//     cancel_url: 'http://localhost:3000/cancel', // URL de cancelación de donación
//   });
//   return session;
// }

// createPayment(stripeRequestBody: StripeRequestBody): Promise<any> {
//   let sumAmount = 0;
//   stripeRequestBody.donations.forEach((donation) => {
//     sumAmount = sumAmount + donation.donation;
//     if (!donation.id) {
//       donation.id = uuid(); // Genera un ID único si no se proporciona uno
//     }
//   });
//   return this.stripe.paymentIntents.create({
//     amount: sumAmount * 100,
//     currency: stripeRequestBody.currency,
//   });
// }