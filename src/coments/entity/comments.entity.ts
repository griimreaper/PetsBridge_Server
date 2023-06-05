import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { AsPublication } from 'src/as_publications/entity/as_publications.entity';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Users } from 'src/users/entity/users.entity';

@Table
export class Comments extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey( () => Users) 
  @Column({
    type: DataType.UUID,
  })
    userId: string;
  
  @ForeignKey( ()=> Publications)
  @Column({
    type: DataType.UUID,
  })
    pubId: string;

  @ForeignKey(() => AsPublication)
  @Column({
    type:DataType.INTEGER,
  })
    asPubId:number;

  @Column
    description: string;

  @BelongsTo(() => Publications)
    publication: Publications;

  @BelongsTo( () => Users)
    user: Users;

  @BelongsTo(() => AsPublication)
    as_publication: AsPublication;
}