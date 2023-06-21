import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from '../users/entity/users.entity';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';

const values = [ '0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5' ];

@Table({
  timestamps:true,
  createdAt:true,
  updatedAt:false,
})
export class Review extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    idAsociacion: string;

  @ForeignKey(() => Users)
  @Column({
    type:DataType.UUID,
  })
    idUser: string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    review:string;

  @Column({
    type:DataType.ENUM,
    values:values,
    allowNull:false,
  })
    rate: string;

  @BelongsTo(() => Users)
    user: Users;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
}