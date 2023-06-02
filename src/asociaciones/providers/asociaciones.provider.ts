import { Asociaciones } from '../entity/asociaciones.entity';

export const asociacionesProviders = [
  {
    provide: 'ASOCIACIONES_REPOSITORY',
    useValue: Asociaciones,
  },
];