import { DataTypes } from 'sequelize';
import { UUIDV4 } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class Imagen extends Model<Imagen> {
  @Column({
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  })
    id: string;
  
  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    validate: {
      isUrl: true,
    },
  })
    urls: Array<string>;
}