import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Users } from 'src/users/entity/users.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { AnimalSpecie } from './dto/animals.dto';
import { AnimaleGender } from './dto/animals.dto';

const animalGender =  AnimaleGender;
const animalSpecie = AnimalSpecie;
@Table({
  timestamps:true,
  updatedAt: false,
  createdAt: 'registredAt',
  tableName: 'animals',
})
export class Animal extends Model {
  @Column({
    type:DataType.UUID,
    defaultValue:DataType.UUIDV4, // Or DataTypes.UUIDV1
    primaryKey:true,
  })
    id: string; 

  @ForeignKey(() => Asociaciones)
    as_id: string;

  @BelongsTo(() => Asociaciones)
    asociacion: Asociaciones;
  
  @BelongsToMany(() => Users, () => Adoption)
    usersAdopt: Users[];

  @ForeignKey(() => Users)
    userId: string;
    
  @BelongsTo(() => Users)
    userAnimal: Users[];

  @Column({
    type:DataType.STRING,
    allowNull:false,
  })
    name: string;

  @Column({
    type:DataType.ENUM,
    values: [ animalSpecie.AVE, animalSpecie.CAT, animalSpecie.DOG, animalSpecie.ROEDOR, animalSpecie.OTRO ],
    allowNull:false,
  })
    specie: string;

  @Column({
    type:DataType.ENUM,
    values: [ animalGender.FEMALE, animalGender.MALE ],
    allowNull:false,
  })
    gender:string;

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
  
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
    image: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    country: string;
    
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    state: string;
 
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    city: string;    

  @Column({
    allowNull: true,
  })
    age_M: number;  

  @Column
    age_Y: number;  

  @Column
    weight: number;  
}