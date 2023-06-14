import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Render, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { Response } from 'express';
import { DonationsPay } from './dto/donationsPay.dto';
import { Donations } from 'src/donations/entity/donations.entity';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

interface DonationProperties {
  paymentId: string;
  amount_total: number;
  status: string;
  success_url: string;
  url: string;
}

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    @Inject('DONATIONS_REPOSITORY')
    private readonly donationRepository: typeof Donations,
  ) {}

  @Post('checkout')
  async createCheckoutSession(@Res() response: Response) {
    try {
      const res = await fetch('/checkout-sessions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_STRIPE_SECRET_KEY',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'payment_method_types[]=card&line_items[][price]=PRICE_ID&line_items[][quantity]=1&mode=payment&success_url=https://example.com/success&cancel_url=https://example.com/cancel',
      });
      const data = await res.json();
      response.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/create-donations')
  async createDontationsStripe(
  @Body() body: DonationsPay,
    @Res() response: Response,
  ) {
    try {
      const donationLink = await this.stripeService.createPrueba(body);

      const donationProperties: DonationProperties = {
        paymentId: donationLink.id,
        amount_total: donationLink.amount_total,
        status: donationLink.status,
        success_url: donationLink.success_url,
        url: donationLink.url,
      };

      const donations = {
        paymentId: donationLink.id, // Asigna el id de donación
        id_Users: body.idUser, // Asigna el idUser
        id_Asociations: body.idAsociations,
        email: body.email,
        message: body.message,
        mount: donationLink.amount_total,
        status: donationLink.status,
        urlDonation: donationLink.url,
      };
      // console.log('dasdasdadad', donations);
      const donationsDb = await this.donationRepository.create({
        ...donations,
      });

      response.status(HttpStatus.CREATED).json({ link: donationsDb });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('donations/:userId')
  async getDonationsByUser(
    @Param('userId') userId: string,
  ): Promise<Donations[]> {
    const donations = await this.stripeService.getDonationsByUserId(userId);
    // Aquí puedes realizar cualquier lógica adicional necesaria antes de devolver la respuesta
    return donations;
  }

  @Get('donations/:associationId')
  async getDonationsByAssociation(
    @Param('associationId') associationId: string,
  ): Promise<Donations[]> {
    const donations = await this.stripeService.getDonationsByAssociationId(
      associationId,
    );
    // Aquí puedes realizar cualquier lógica adicional necesaria antes de devolver la respuesta

    return donations;
  }
}

