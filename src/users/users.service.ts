import { Inject, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { hash } from 'bcrypt';
import { Publications } from 'src/publications_users/entity/publications_users.entity';
import { Animal } from 'src/animals/animals.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private serviceUsers: typeof Users,
    private readonly configureService: ConfigService,
  ) {}

  async findAll(): Promise<Users[]> {
    try {
      const api = this.configureService.get('DB_HOST');
      return await this.serviceUsers.findAll(api);
    } catch (error) {
      throw new HttpException('Error al intentar buscar los usuarios', 404);
    }
  }

  async createUser(body:CreateUserDto): Promise<{ send: string; status: number }> { // funcion para crear usuario
    const { email } = body;
    //verificamos que ese email no exista en la tabla asociaciones
    if (await Asociaciones.findOne({ where: { email } })) return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST }; 
    //findOrCreate para que no se duplique el email
    const [users, created] = await this.serviceUsers.findOrCreate({ where: { email }, defaults: { ...body } }); 
    //condicion por si se encontro un email en uso
    if (!created) return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST };
    //status 201
    return { send:'El usuario se creo exitosamente.', status: HttpStatus.CREATED };
  }

  async findById(id: string): Promise<Users> {
    try {
      const user = await this.serviceUsers.findByPk(id, {
        include: [{
          model: Publications,
          attributes: {
            exclude: ['userId'],
          },
        }],
      });

      console.log(user);  
      if (!user) {
        throw new Error('No hay con ese id');
      }

      return user;
    } catch (error) {
      throw new HttpException('No se enontro el usuario', 404);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user = await this.serviceUsers.findByPk(parseInt(id));

      if (!user) {
        throw new Error(`El usuarios con el ID '${id}' no se encuentra`);
      }
      await this.serviceUsers.destroy({ where: { id: parseInt(id) } });
      return 'Eliminado';
    } catch (error) {
      throw new HttpException('Error al eliminar el usuario', 404);
    }
  }

  async update(
    id: string,
    {
      first_Name,
      last_Name,
      email,
      phone,
      password,
      country,
      isGoogle,
      isActive,
    },
    profilePic?: any,
  ): Promise<string> {
    try {
      if (
        !first_Name &&
        !last_Name &&
        !email &&
        !phone &&
        !password &&
        !profilePic &&
        !country &&
        !isGoogle
      )
        return 'Nada que actualizar';
      const user = await this.serviceUsers.findByPk(id);
      if (user) {
        if (first_Name) user.firstName = first_Name;
        if (last_Name) user.lastName = last_Name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) {
          const hashedPassword = await hash(password, 10);
          user.password = hashedPassword;
        }
        if (profilePic) user.profilePic = profilePic;
        if (country) user.country = country;
        if (isGoogle) user.isGoogle = isGoogle;
        await user.save();
        return 'Actualizado';
      } else {
        return 'No existe el Usuario';
      }
    } catch (error) {
      throw new HttpException('Error al editar el usuario', 404);
    }
  }
}
