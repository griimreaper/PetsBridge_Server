import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { AsPublication } from 'src/as_publications/entity/as_publications.entity';
import { Users } from 'src/users/entity/users.entity';

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
    allowNull:true,
  })
    us_Id: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    as_Id: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;

  @BelongsTo(() => Users)
    user: Users;
  
  @HasOne(() => Adoption)
    adoption: Adoption;

  @HasOne(() => AsPublication)
    as_publication:AsPublication;

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
    description;
}