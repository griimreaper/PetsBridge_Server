import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Animal } from 'src/animals/animals.entity';
import { Users } from 'src/users/entity/users.entity';
import { UsersAssociated } from './usersAssociated.entity';
import * as bcrypt from 'bcrypt';

@Table
export class Asociaciones extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue:DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({
    unique: true,
  })
    email: string;

  @Column
    password: string;

  async comparePassword(password:string): Promise<boolean> {
    const result = await bcrypt.compare(password, this.password);
    return Promise.resolve(result);
  }

  @Column
    name: string;

  @Column
    image: string;

  @Column
    description: string;
    
  @Column
    status: boolean;

  @Column
    country: string;

  @HasMany(()=> Animal)
    pets: Animal[];

  @BelongsToMany(()=> Users, ()=> UsersAssociated)
    members: Users[];

}