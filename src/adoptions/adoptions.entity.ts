import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Animal } from '../animals/animals.entity';
import { Users } from '../users/entity/users.entity';

@Table({
  timestamps:true,
  updatedAt:false,
  createdAt:'adoptedAt',
  tableName: 'adoptions',
})
export class Adoption extends Model {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id: string;

  @Column
    status: string;

  @ForeignKey(()=> Animal)
  @Column({
    type: DataType.UUID,
    allowNull:false,
  })
    animalID: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.UUID,
    allowNull:false,
  })
    userID:string;

  @BelongsTo(() => Animal)
    animal:Animal;

  @BelongsTo(() => Users)
    user: Users;

}