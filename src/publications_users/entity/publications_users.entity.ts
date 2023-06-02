import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';

@Table({ timestamps: false })
export class Publications extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;
    
  @ForeignKey(() => Users)
  @Column({
    type: DataType.UUID,
  })
    userId: string;

  @BelongsTo(() => Users)
    user: Users;  

  @Column
    title: string;

  @Column
    description: string;

  @Column
    isActive: boolean;

  @Column
    datePublication: Date;

  @Column(
    {
      type: DataType.ARRAY(DataType.STRING),
    },
  )
    imagen: string[];  

  
}
