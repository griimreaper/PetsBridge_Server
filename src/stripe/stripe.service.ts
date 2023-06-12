import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { DonationsPay } from './dto/donationsPay.dto';
import { Donations } from 'src/donations/entity/donations.entity';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.API_SECRET_STRIPE, {
      apiVersion: '2022-11-15',
    });
  }

  async createPrueba(body: DonationsPay): Promise<any> {
    const data: Promise<string> = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Donations',
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

  async getDonationsByUser(userId: string): Promise<Donations[]> {
    const donations = await Donations.findAll({
      where: {
        id_Users: userId,
      },
    });

    for (const donation of donations) {
      if (donation.status === 'pending') {
        const isDonationSuccessful = await this.verifyDonationWithStrapi(
          donation.paymentId,
        );

        if (isDonationSuccessful) {
          this.sendThankYouEmail(donation.id_Users);

          // Cambiar el estado a success
          donation.status = 'success';
          await donation.save();
        }
      }
    }

    return donations;
  }

  private async verifyDonationWithStrapi(paymentId: string): Promise<boolean> {
    const response = await fetch(`https://api.strapi.com/donations/${paymentId}`);
    const data = await response.json();
    const isDonationSuccessful = data.success_url;
    return isDonationSuccessful;
  }

  private sendThankYouEmail(userId: string): void {
    //Logica email
  }
}
