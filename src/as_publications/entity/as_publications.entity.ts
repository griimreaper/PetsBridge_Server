import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Table({
  timestamps:false,
})
export class AsPublication extends Model<AsPublication> {

  @ForeignKey(() => Animal)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    ID_Animal:string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    ID_Asociation:string;
 
  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    title:string;

  @Column({
    type:DataType.STRING(1000),
    allowNull:false,
  })
    description:string;

  @Column({
    type:DataType.BOOLEAN,
    allowNull:false,
  })
    isActive:boolean;

  @Column({
    type:DataType.INTEGER,
    defaultValue:0,
  })
    likes:number;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    createdAt:string;

  @BelongsTo(() => Asociaciones)
    asociacion:Asociaciones;

  @BelongsTo(() => Animal)
    Animal:Animal;
}