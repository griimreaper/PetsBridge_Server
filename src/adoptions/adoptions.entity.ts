import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { Users } from '../users/entity/users.entity';

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
  
  @ForeignKey(() => Users)
  @Column({
    type:DataType.INTEGER,
    allowNull:false,
  })
    userID:number;

  @ForeignKey(()=> Animal)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    animalID:string;

  @BelongsTo(() => Animal)
    animal:Animal;

  @BelongsTo(() => Users)
    user:Users;
}