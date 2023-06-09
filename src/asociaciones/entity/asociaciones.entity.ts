import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { RedSocial } from './redSocial.entity';

@Table({ tableName: 'asociaciones', timestamps: false })
export class Asociaciones extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
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
    dateStart: Date;

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

  @HasMany(()=> Animal)
    pets: Animal[];

  @HasMany(() => RedSocial)
    reds: RedSocial;

}