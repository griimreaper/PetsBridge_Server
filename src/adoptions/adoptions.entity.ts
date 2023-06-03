import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { Users } from 'src/users/entity/users.entity';

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
    id: string;
    
  @ForeignKey(()=> Animal)
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    allowNull:false,
  })
    animalID: string;

  @ForeignKey(() => Users)
  @Column
    userID: string;

}