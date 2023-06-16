import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Comments } from '../../coments/entity/comments.entity';
import { Users } from '../../users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Table({ timestamps: false, tableName: 'publications' })
export class Publications extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => Asociaciones)
    asocId?: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;

  @ForeignKey(() => Users)
    userId?: string;

  @BelongsTo(() => Users)
    user: Users[];

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
  
  @HasMany(() => Comments)
    comments: Comments[];
  
}
