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
    isGoogle: boolean;

  @Column
    country: string;
    
  @Column
    phone: number;

  @BelongsToMany(()=> Asociaciones, () => UsersAssociated)
    fundations: Asociaciones[];
}
