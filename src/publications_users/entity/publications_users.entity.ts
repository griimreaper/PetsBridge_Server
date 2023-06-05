import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Comments } from 'src/coments/entity/comments.entity';
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
    likes: number;

  @Column
    description: string;

  @Column
    isActive: boolean;

  @Column
    datePublication: string;

  @Column(
    {
      type: DataType.ARRAY(DataType.STRING),
    },
  )
    imagen: string[];  

  @Column({
    type:DataType.ARRAY(DataType.INTEGER),
    allowNull:false,
  })
    topics:number[];
  
  @HasMany(() => Comments)
    comments: Comments[];
  
}
