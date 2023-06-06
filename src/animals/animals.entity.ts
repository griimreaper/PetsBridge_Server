import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { User } from 'src/users/entity/users.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { Specie } from 'src/species/species.entity';


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
  
  @ForeignKey( () => User)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    userId:string;
  
  @ForeignKey(() => Asociaciones)
  @Column({
    type:DataType.UUID,
    allowNull:false,
  })
    as_id: string;

  @ForeignKey(() => Specie)
  @Column({
    type:DataType.INTEGER,
    allowNull:false,
  })
    specieId: number;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;

  @BelongsTo( () => User)
    user: User;

  @BelongsTo( () => Specie)
    specie:Specie;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    name: string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    gender:string;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    breed: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
    images:string[];

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