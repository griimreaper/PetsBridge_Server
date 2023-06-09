import { Model } from 'sequelize-typescript';
import { Column, DataType, ForeignKey, Table, BelongsTo } from 'sequelize-typescript';
import { Asociaciones } from './asociaciones.entity';

@Table({ timestamps: false, tableName: 'redsocials' })
export class RedSocial extends Model<RedSocial> {
  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    as_id: string;
  
  @BelongsTo(() => Asociaciones)
    redAsociacion: Asociaciones[];
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;

  @Column
    url: string;
}
