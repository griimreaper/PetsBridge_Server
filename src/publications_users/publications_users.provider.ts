import { Publications } from './entity/publications_users.entity';

export const publicationsProviders = [
  {
    provide: 'PUBLICACIONES_REPOSITORY',
    useValue: Publications,
  },
];
