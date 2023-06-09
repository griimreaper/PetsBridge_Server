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
import { Comments } from 'src/coments/entity/comments.entity';
import { Donations } from 'src/donations/entity/donations.entity';

@Table({ tableName: 'users', timestamps: false })
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
    image: string;

  @Column
    country: string;

  @Column
    phone: number;

  @Column
    isGoogle: boolean;

  @Column
    isActive: boolean;

<<<<<<< HEAD
  @Column
    reset:string;

  @Column({
    type:DataType.BOOLEAN,
    defaultValue:false,
  })
    verified:boolean;
  
=======
>>>>>>> 6a1c7ac4d0ee5b24d3d86db36df2aaf42d1d994c
  @HasMany(() => Publications)
    public: Publications[];

  @HasMany( () => Comments)
    comments: Comments[];

  @HasMany( () => Donations)
    donations: Donations[];

  @BelongsToMany(() => Animal, () => Adoption)
    animalsAdopt: Animal[];

  @HasMany(() => Animal)
    animalUser: Animal[];
}
