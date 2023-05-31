import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Table({
  timestamps:false,
})
export class Animal extends Model<Animal> {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    as_Id: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;

  @Column({
    type:DataType.STRING,
    unique: true,
    allowNull:false,
  })
    name: string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    specie: string;

  @Column({
    type:DataType.ENUM,
    values:['male', 'female'],
    allowNull:false,
  })
    gender:string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    breed: string;

  @Column({
    type:DataType.ENUM,
    values:['adopted', 'pending', 'homeless'],
    allowNull:false,
  })
    status: string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    description: string;
}