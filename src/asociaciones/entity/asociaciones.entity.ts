import { Table, Column, Model, DataType, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class Asociaciones extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column
    email: string;

  @Column
    password: string;

  @Column
    name: string;

  @Column
    status: boolean;

  @Column
    country: string;

  @Column
    members: string;
}