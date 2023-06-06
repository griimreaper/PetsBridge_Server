import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Users } from 'src/users/entity/users.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';

@Table({
  timestamps:false,
})
export class Animal extends Model<Animal> {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
    unique: true,
  })
    id: string;

  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
  })
    as_id: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
  
  @BelongsToMany(() => Users, () => Adoption)
    adoption: Users;

  @Column({
    type:DataType.STRING,
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
  
  @Column
    image: string;
}