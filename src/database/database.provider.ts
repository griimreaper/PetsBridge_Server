import { Sequelize } from 'sequelize-typescript';
import { Imagen } from '../file/Entity/Imagen.entity';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      sequelize.addModels([Imagen]);
      await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
