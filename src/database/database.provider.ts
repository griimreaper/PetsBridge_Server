import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/users/entity/users.entity';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Animal } from 'src/animals/animals.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Adoption } from 'src/adoptions/adoptions.entity';
// import { UsersAssociated } from 'src/asociaciones/entity/usersAssociated.entity';
import { RedSocial } from 'src/asociaciones/entity/redSocial.entity';
import { Donations } from 'src/donations/entity/donations.entity';
import { Comments } from 'src/coments/entity/comments.entity';

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
        logging: false,
        native: false,
      });
      sequelize.addModels([
        Users,
        Asociaciones,
        Publications,
        Adoption,
        Comments,
        RedSocial,
        Animal,
        Donations,
      ]);
      await sequelize.sync({ force: true });
      await sequelize.sync();
      return sequelize;
    },
  },
];