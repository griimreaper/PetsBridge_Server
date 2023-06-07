import { DonationsPay } from "./donations";


export interface StripeRequestBody {
    donations: DonationsPay[];
    currency: string;
  }