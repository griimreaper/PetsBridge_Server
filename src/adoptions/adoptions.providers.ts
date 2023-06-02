import { Adoption } from './adoptions.entity';

export const adoptionsProviders = [{
  provide:'ADOPTIONS_REPOSITORY',
  useValue: Adoption,
}];