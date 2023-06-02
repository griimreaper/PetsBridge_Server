import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';

@Table
export class Publications extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Users)
  @Column
  userId: number;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  isActive: boolean;

  @Column
  datePublication: Date;

  @BelongsTo(() => Users)
  user: Users;
}
