import { Animal } from './animals.entity';

export const animalsProviders = [{
  provide:'ANIMALS_REPOSITORY', //This will be a constant in the future
  useValue:Animal,
}];