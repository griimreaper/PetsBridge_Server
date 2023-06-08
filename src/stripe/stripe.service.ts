import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeRequestBody } from './types/stripeRequestBody';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.API_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  createPayment(stripeRequestBody: StripeRequestBody): Promise<any> {
    let sumAmount = 0;
    stripeRequestBody.donations.forEach((donation) => {
      sumAmount = sumAmount + donation.donation;
      if (!donation.id) {
        donation.id = uuid(); // Genera un ID único si no se proporciona uno
      }
    });
    return this.stripe.paymentIntents.create({
      amount: sumAmount * 100,
      currency: stripeRequestBody.currency,
    });
  }
}
