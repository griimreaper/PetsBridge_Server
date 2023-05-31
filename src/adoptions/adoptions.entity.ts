import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';

@Table({
  timestamps:true,
  updatedAt:false,
  createdAt:'AdoptedAt',
})
export class Adoption extends Model<Adoption> {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id;
    
  @ForeignKey(()=> Animal)
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
  })
    animalID;
}