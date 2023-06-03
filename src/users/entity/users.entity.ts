import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { Animal } from 'src/animals/animals.entity';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { UsersAssociated } from 'src/asociaciones/entity/usersAssociated.entity';

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

  @BelongsToMany(()=> Asociaciones, () => UsersAssociated)
    fundations: Asociaciones[];

  @BelongsToMany(() => Animal, () => Adoption)
    animals: Animal;
}
