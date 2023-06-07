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

@Table({ tableName: 'Users' })
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
    img_profile: string;

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

  @BelongsToMany(() => Animal, () => Adoption)
    animals: Animal;

  @HasMany(() => Animal)
    animalUser: Animal[]; 
}
