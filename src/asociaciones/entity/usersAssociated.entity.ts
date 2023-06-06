import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';
import { Asociaciones } from './asociaciones.entity';

@Table
export class UsersAssociated extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
    id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.UUID,
  })
    user_id: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type: DataType.UUID,
  })
    asoc_id: string;

}
