import {
  AutoIncrement,
  BelongsToMany,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { UsersAssociated } from 'src/asociaciones/entity/usersAssociated.entity';

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

  @BelongsToMany(()=> Asociaciones, () => UsersAssociated)
    fundations: Asociaciones[];
}
