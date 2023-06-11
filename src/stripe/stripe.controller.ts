import { Body, Controller, Get, HttpStatus, Post, Render, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeRequestBody } from './interface/stripeRequestBody.interface';
import { Response } from 'express';
import { DonationsPay } from './dto/donationsPay.dto';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}


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
  ) {
    const info = await this.stripeService.createPrueba(body);
    return info;
  }


  // @Get('checkout')
  // @Render('checkout') // Renderiza la plantilla 'checkout.hbs' (o el nombre de tu plantilla) al acceder a '/stripe/checkout'
  // showCheckoutPage() {
  //   return;
  // }
  // @Post()
  // createPayments(
  // @Res() response: Response,
  //   @Body() stripeRequestBody: StripeRequestBody,
  // ) {
  //   this.stripeService
  //     .createPayment(stripeRequestBody)
  //     .then((res) => {
  //       response.status(HttpStatus.CREATED).json(res);
  //     })
  //     .catch((err) => {
  //       response.status(HttpStatus.BAD_REQUEST).json(err);
  //     });
  // }
}
