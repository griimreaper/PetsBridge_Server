import { AsPublication } from '../entity/as_publications.entity';

export const AsPublicationProviders = [{
  provide:'AS_PUBLICATION_REPOSITORY',
  useValue:AsPublication,
}];