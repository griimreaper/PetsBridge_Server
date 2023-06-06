import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { hash } from 'bcrypt';
import { Publications } from 'src/publications_users/entity/publications_users.entity';

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
      throw new Error(
        `Error al intentar buscar los usuarios: ${error.message}`,
      );
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

  // async createUser(createUserDto: CreateUserDto) {
  //   try {

  //     const newUser = await this.serviceUsers.create({ ...createUserDto });
  //     return newUser;
  //   } catch (error) {
  //     throw new Error(
  //       `Error al intentar crear un nuevo usuarios: ${error.message}`,
  //     );
  //   }
  // }

  async findById(id: string): Promise<Users> {
    try {
      const user = await this.serviceUsers.findByPk(id, {
        include: Publications,
      });

      if (!user) {
        throw new Error('No hay con ese id');
      }

      return user;
    } catch (error) {
      throw new Error(`No se pudo encontrar el usuario: ${error.message}`);
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
      throw new Error(`Error al intentar remover el usuario: ${error.message}`);
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
      status,
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
        !isGoogle &&
        !status
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
        if (profilePic) user.img_profile = profilePic;
        if (country) user.country = country;
        if (isGoogle) user.isGoogle = isGoogle;
        if (status) user.status = status;
        await user.save();
        return 'Actualizado';
      } else {
        return 'No existe el Usuario';
      }
    } catch (error) {
      throw new Error(`Error al intentar editar el usuario: ${error.message}`);
    }
  }
}
