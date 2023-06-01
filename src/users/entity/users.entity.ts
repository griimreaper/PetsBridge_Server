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
  phone: number;

  @Column
  imgProf: string;

  @Column
  country: string;

  @Column
  isGoogle: boolean;

  @Column
  status: boolean;
}
