import { Column, Model, Table, DataType, HasOne } from 'sequelize-typescript';
import { Adoption } from 'src/adoptions/adoptions.entity';

@Table({
  timestamps:false,
})
export class Animal extends Model<Animal> {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id;

  @Column({
    type:DataType.STRING,
    unique: true,
    allowNull:false,
  })
    name;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    specie;

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
    breed;

  @Column({
    type:DataType.ENUM,
    values:['adopted', 'pending', 'homeless'],
    allowNull:false,
  })
    status;

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    description;
  
  @HasOne(()=>Adoption)
    adoption:Adoption;
}