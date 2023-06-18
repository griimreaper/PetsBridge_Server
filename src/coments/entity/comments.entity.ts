import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Publications } from '../../publications_users/entity/publications_users.entity';
import { Users } from '../../users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Table({ tableName: 'comments' })
export class Comments extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => Users)
    userId: string;

  @ForeignKey(() => Asociaciones)
    asocId: string;

  @ForeignKey(()=> Publications)
    pubId: string;

  @Column
    description: string;

  @BelongsTo(() => Publications)
    publication: Publications;

  @BelongsTo(() => Asociaciones)
    commentsAsoc: Asociaciones;

  @BelongsTo(() => Users)
    commentsUser: Users;
}