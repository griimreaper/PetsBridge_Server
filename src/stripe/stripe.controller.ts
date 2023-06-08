import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeRequestBody } from './types/stripeRequestBody';
import { Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  createPayments(
  @Res() response: Response,
    @Body() stripeRequestBody: StripeRequestBody,
  ) {
    this.stripeService
      .createPayment(stripeRequestBody)
      .then((res) => {
        response.status(HttpStatus.CREATED).json(res);
      })
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
