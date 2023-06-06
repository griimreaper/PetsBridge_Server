import { Model } from 'sequelize-typescript';
import { Column, DataType, ForeignKey, Table, BelongsTo } from 'sequelize-typescript';
import { Asociaciones } from './asociaciones.entity';

@Table
export class RedSocial extends Model<RedSocial> {
  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    as_Id: string;
  
  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;

  @Column
    url: string;
}