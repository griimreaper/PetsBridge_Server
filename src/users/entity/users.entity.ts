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
  first_Name: string;

  @Column
  last_Name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  imgProf: string;

  @Column
  country: string;

  @Column
  phone: number;

  @Column
  isGoogle: boolean;

  @Column
  status: boolean;
}
