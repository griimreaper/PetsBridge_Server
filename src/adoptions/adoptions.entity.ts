import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { Users } from 'src/users/entity/users.entity';

@Table({
  timestamps:true,
  updatedAt:false,
  createdAt:'AdoptedAt',
  tableName: 'adoptions',
})
export class Adoption extends Model {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id: string;
    
  @ForeignKey(()=> Animal)
    animalID: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.UUID,
  })
    userID: string;

}