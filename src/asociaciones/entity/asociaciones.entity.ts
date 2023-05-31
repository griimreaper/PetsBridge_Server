import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';

@Table
export class Asociaciones extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({
    unique: true,
  })
    email: string;

  @Column
    password: string;

  @Column
    name: string;

  @Column
    image: string;

  @Column
    status: boolean;

  @Column
    country: string;

  @HasMany(()=> Animal)
    pets: Animal[];

  @Column
    members: string;
}