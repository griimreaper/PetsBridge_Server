import { Model } from 'sequelize-typescript';
import { Column, DataType, ForeignKey, Table, BelongsTo } from 'sequelize-typescript';
import { Asociaciones } from './asociaciones.entity';

@Table
export class SocialReds extends Model<SocialReds> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    nombre_red: string;

  @Column
    body: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    as_Id: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
}