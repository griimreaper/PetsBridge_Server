import { UUID } from 'crypto';

export class CreateDonationsDto {
  id: number;

  id_Asociations?: UUID;

  id_Users?: UUID;

  mount: number;

  message: string;

  paymentId: string; // Nueva propiedad para almacenar el ID de pago
}
