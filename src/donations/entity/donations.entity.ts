import { UUID } from 'crypto';
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

@Table
export class Donations extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
    id: number;

  @Column
    id_Asociations: UUID;

    @ForeignKey(() => Users)
  @Column
    id_Users: UUID;

  @Column({ type: 'float' }) // Agregar atributo floatAttribute de tipo float
    mount: number;

  @Column
    message: string;

    @Column
    paymentId: string; // Nueva propiedad para almacenar el ID de pago
}
