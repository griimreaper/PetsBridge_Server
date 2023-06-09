import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

export interface IValidateUser extends Users {
  rol: string;
}

export interface IValidateAsociaciones extends Asociaciones {
  rol: string;
}
