import { Sequelize } from 'sequelize-typescript';
import { Users } from '../users/entity/users.entity';
import { Publications } from '../publications_users/entity/publications_users.entity';
import { Animal } from '../animals/animals.entity';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';
import { Adoption } from '../adoptions/adoptions.entity';
import { Donations } from '../donations/entity/donations.entity';
import { Comments } from '../coments/entity/comments.entity';
import { RedSocial } from '../asociaciones/entity/redSocial.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        dialectModule: require('pg'),
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        logging: false,
        native: false,
      });
      sequelize.addModels( [
        Users,
        Asociaciones,
        Animal,
        Publications,
        Donations,
        Adoption,
        Comments,
        RedSocial,
      ]);
      try {
        await sequelize.sync({ force: true });
      } catch (error) {
        console.error('SEQUALIZE SYNC ERROR: ', error);
      }
      return sequelize;
    },
  },
];
//