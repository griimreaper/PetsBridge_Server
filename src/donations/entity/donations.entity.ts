import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Users } from '../../users/entity/users.entity';
import { Asociaciones } from '../../asociaciones/entity/asociaciones.entity';

@Table({ tableName: 'donations' })
export class Donations extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
    id: number;

  @ForeignKey(() => Asociaciones)
    id_Asociations: string;

  @ForeignKey(() => Users)
    id_Users: string;

  @Column
    email: string;

  @BelongsTo(() => Users)
    userDonation: string;

  @Column({ type: 'float' }) // Agregar atributo floatAttribute de tipo float
    mount: number;

  @Column
    message: string;

  @Column
    paymentId: string; // Nueva propiedad para almacenar el ID de pago

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
}
