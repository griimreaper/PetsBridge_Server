import {
  Column,
  HasMany,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Publications } from 'src/publications_users/entity/publications_users.entity';

@Table
export class Users extends Model {
  
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

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
  
  @HasMany(() => Publications)
    public: Publications[];
}
