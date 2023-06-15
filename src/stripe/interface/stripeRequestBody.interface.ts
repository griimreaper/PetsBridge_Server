import { DonationsPay } from '../dto/donationsPay.dto';


export interface StripeRequestBody {
  donations: DonationsPay[];
  currency: string;
}