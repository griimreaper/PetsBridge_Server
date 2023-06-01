import { UUID } from 'crypto';

export class CreatePublicationsDto {
  id: number;
  id_Asociations?: UUID;
  id_Users?: UUID;
  mount: number;
  message: string;
}
