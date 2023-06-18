import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';
import { DonationsPay } from './dto/donationsPay.dto';
import { Donations } from 'src/donations/entity/donations.entity';

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

  @Post('/create-donations')
  async createDontationsStripe(
  @Body() body: DonationsPay,
    @Res() response: Response,
  ) {
    try {
      const donationLink = await this.stripeService.createPrueba(body);

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

