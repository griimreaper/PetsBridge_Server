import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';

@Table({ tableName: 'donations' })
export class Donations extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
    id: number;

  @Column
    id_Asociations: string;

    @ForeignKey(() => Users)
    id_Users: string;

  @Column({ type: 'float' }) // Agregar atributo floatAttribute de tipo float
    mount: number;

  @Column
    message: string;

    @Column
    paymentId: string; // Nueva propiedad para almacenar el ID de pago
}
