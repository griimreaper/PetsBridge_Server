import { Sequelize } from 'sequelize-typescript';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Users } from 'src/users/entity/users.entity';

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
        database: 'petsbridge',
      });
      sequelize.addModels([Users, Publications]);
      await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
