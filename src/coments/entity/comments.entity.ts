import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Users } from 'src/users/entity/users.entity';

@Table({ tableName: 'comments' })
export class Comments extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey( () => Users) 
    userId: string;
  
  @ForeignKey( ()=> Publications)
    pubId: string;

  @Column
    description: string;

  @BelongsTo(() => Publications)
    publication: Publications;

  @BelongsTo( () => Users)
    commentsuser: Users;
}