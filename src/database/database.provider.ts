import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Animal } from 'src/animals/animals.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';
import { Donations } from 'src/donations/entity/donations.entity';
import { Comments } from 'src/coments/entity/comments.entity';
import { RedSocial } from 'src/asociaciones/entity/redSocial.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        dialectOptions: {
          concurrency: 1,
        },
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
      await sequelize.sync({ force: false });
      return sequelize;
    },
  },
];