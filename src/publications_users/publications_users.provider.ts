import { Publications } from './entity/publications_users.entity';

export const publicationsProviders = [
  {
    provide: 'PUBLICATIONS_REPOSITORY',
    useValue: Publications,
  },
];
