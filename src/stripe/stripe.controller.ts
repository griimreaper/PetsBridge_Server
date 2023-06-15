import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Render, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';
import { DonationsPay } from './dto/donationsPay.dto';
import { Donations } from 'src/donations/entity/donations.entity';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { MailsService } from '../mails/mails.service';

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
    private readonly mailsService: MailsService,
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
      const donationsDb = await this.donationRepository.create({
        ...donations,
      });
      const conso = await this.stripeService.getDonationById(donationsDb.id);
      console.log(conso);
      this.mailsService.sendMails({ donation:donationsDb, 
        asociacion: conso.dataValues.asociacion.nameOfFoundation }, 'DONATE');

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
    return donations;
  }

  @Get('donations/:associationId')
  async getDonationsByAssociation(
    @Param('associationId') associationId: string,
  ): Promise<Donations[]> {
    const donations = await this.stripeService.getDonationsByAssociationId(
      associationId,
    );
    return donations;
  }

  @Get('donations/email/:email')
  async getDonationsByEmail(
    @Param('email') email: string,
  ): Promise<Donations[]> {
    const donations = await this.stripeService.getDonationsByEmail(email);
    return donations;
  }

}

