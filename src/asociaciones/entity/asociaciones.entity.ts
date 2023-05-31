import { Table, Column, Model, DataType } from 'sequelize-typescript';

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