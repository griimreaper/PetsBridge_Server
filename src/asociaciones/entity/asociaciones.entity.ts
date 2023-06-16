import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Animal } from '../../animals/animals.entity';
import { RedSocial } from './redSocial.entity';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Comments } from 'src/coments/entity/comments.entity';
import { Donations } from 'src/donations/entity/donations.entity';

@Table({ tableName: 'asociaciones', timestamps: false })
export class Asociaciones extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({
    unique: true,
    allowNull: false,
  })
    email: string;

  @Column({
    allowNull: false,
  })
    password: string;

  @Column({
    allowNull: false,
  })
    nameOfFoundation: string;

  @Column
    image: string;

  @Column
    dateStart: string;

  @Column
    description: string;

  @Column
    phone: string;

  @Column
    country: string;

  @Column
    address: string;

  @Column
    isActive: boolean;

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

  @HasMany(()=> Animal)
    pets: Animal[];

  @HasMany(() => Donations)
    donations: Donations[];

  @HasMany(() => RedSocial)
    reds: RedSocial;

  @HasMany(() => Publications)
    publications: Publications[];

  @HasMany(() => Comments)
    comments: Comments[];

}