import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  first_Name: string;

  @Column
  last_Name: string;

  @Column
  imgProf: string;

  @Column
  status: boolean;

  @Column
  phone: number;

  @Column
  rol: string;
}
