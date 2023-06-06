import { Table, Column, DataType, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';

@Table({
  timestamps:false,
})
export class Specie extends Model<Specie> {

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    specie:string;

  @HasMany( () => Animal)
    animals: Animal;
}