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
        host: process.env.DP_HOST,
        port: parseInt(process.env.DP_PORT),
        username: process.env.DP_USERNAME,
        password: process.env.DP_PASSWORD,
        database: process.env.DP_DATABASE,
        logging: false, // Habilita los registros detallados en la consola
        native: false,
      });
      sequelize.addModels([
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
        console.error('Sequelize sync error:', error);
      }
      return sequelize;
    },
  },
];
//