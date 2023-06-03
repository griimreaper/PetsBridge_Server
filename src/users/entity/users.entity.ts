import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { UsersAssociated } from 'src/asociaciones/entity/usersAssociated.entity';
import { Comments } from 'src/coments/entity/comments.entity';

@Table
export class Users extends Model {
  
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column
    firstName: string;

  @Column
    lastName: string;

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

  @HasMany( () => Comments)
    comments: Comments[];  

  @BelongsToMany(()=> Asociaciones, () => UsersAssociated)
    fundations: Asociaciones[];
}
