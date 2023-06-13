import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { DonationsPay } from './dto/donationsPay.dto';
import { Donations } from 'src/donations/entity/donations.entity';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

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

  async getDonationsByUserId(userId: string): Promise<Donations[]> {
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('El usuario no existe');
    }

    const donations = await Donations.findAll({
      where: {
        id_Users: userId,
      },
    });

    return donations;
  }

  async getDonationsByAssociationId(
    associationId: string,
  ): Promise<Donations[]> {
    const association = await Asociaciones.findOne({
      where: { id: associationId },
    });
    if (!association) {
      throw new Error('La asociación no existe');
    }

    const donations = await Donations.findAll({
      where: {
        id_Asociations: associationId,
      },
    });

    return donations;
  }

}
