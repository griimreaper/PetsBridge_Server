import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';
import { Adoption } from '../../adoptions/adoptions.entity';
import { Animal } from '../../animals/animals.entity';
import { Publications } from '../../publications_users/entity/publications_users.entity';
import { Comments } from '../../coments/entity/comments.entity';
import { Donations } from '../../donations/entity/donations.entity';

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
  
  @HasMany(() => Publications)
    public: Publications[];

  @HasMany( () => Comments)
    comments: Comments[];  

  @HasMany( () => Donations)
    donations: Donations[];

  @BelongsToMany(() => Animal, () => Adoption)
    animals: Animal;

  @HasMany(() => Animal)
    animalUser: Animal[]; 
}
