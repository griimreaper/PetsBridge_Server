import { Users } from './entity/users.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: Users,
  },
];
