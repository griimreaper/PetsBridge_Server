import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Users } from '../../users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Table({ tableName: 'donations' })
export class Donations extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
    id: number;

  @ForeignKey(() => Asociaciones)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: false,
  // })
    id_Asociations: string;
  // @Column
  // id_Asociations: string;

  @ForeignKey(() => Users)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: false,
  // })
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
}
