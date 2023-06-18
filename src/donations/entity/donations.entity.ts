import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Users } from 'src/users/entity/users.entity';

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

  @Column
    mount: number;

  @Column
    message?: string;

  @Column({
    type: DataType.ENUM,
    values: ['open', 'cancel', 'success'],
  })
    status: string;

  @Column
    paymentId: string; // Nueva propiedad para almacenar el ID de pago

  @Column(DataType.STRING(2000))
    urlDonation: string;
}
