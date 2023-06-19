import {
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
import { UserRole } from 'src/auth/dto/login.dto';

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

  @Column({
    type:DataType.ENUM,
    values: [ UserRole.USER, UserRole.ADMIN ],
    allowNull:false,
  })
    rol: string;

  @Column
    isActive: boolean;

  @HasMany(() => Publications)
    public: Publications[];

  @HasMany( () => Comments)
    comments: Comments[];

  @HasMany( () => Donations)
    donations: Donations[];

  @HasMany(() => Adoption)
    adoption: Adoption;

  @HasMany(() => Animal)
    animalUser: Animal[];

  @Column({
    type:DataType.STRING(1000),
    allowNull:true,
  })
    reset:string;

  @Column({
    type:DataType.BOOLEAN,
    defaultValue:false,
  })
    verified:boolean;

  @Column({
    type:DataType.STRING,
  })
    newEmail:string;
}
