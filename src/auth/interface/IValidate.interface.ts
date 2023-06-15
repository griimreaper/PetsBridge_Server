import { Users } from '../../users/entity/users.entity';
import { Asociaciones } from '../../asociaciones/entity/asociaciones.entity';

export interface IValidateUser extends Users {
  rol: string;

}

export interface IValidateAsociaciones extends Asociaciones {
  rol: string;
  isGoogle: boolean;
}
