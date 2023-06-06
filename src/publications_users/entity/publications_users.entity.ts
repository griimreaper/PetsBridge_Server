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
import { User } from 'src/users/entity/users.entity';

@Table({ timestamps: false })
export class Publications extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;
    
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
    userId: string;

  @BelongsTo(() => User)
    user: User;  

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
    type:DataType.INTEGER,
    allowNull:false,
  })
    topic:number;
  
  @HasMany(() => Comments)
    comments: Comments[];
  
}
