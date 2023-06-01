import { Donations } from './entity/donations.entity';

export const donationsProviders = [
  {
    provide: 'DONATIONS_REPOSITORY',
    useValue: Donations,
  },
];
