import { Inject, Injectable } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-users.dto';

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

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.serviceUsers.create({ ...createUserDto });
      return newUser;
    } catch (error) {
      throw new Error(
        `Error al intentar crear un nuevo usuarios: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<Users> {
    try {
      const user = await this.serviceUsers.findByPk(id);

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
      imgProf,
      country,
      isGoogle,
      status,
    },
  ): Promise<string> {
    try {
      if (
        !first_Name &&
        !last_Name &&
        !email &&
        !phone &&
        !password &&
        !imgProf &&
        !country &&
        !isGoogle &&
        !status
      )
        return 'Nada que actualizar';
      const user = await this.serviceUsers.findByPk(parseInt(id));
      if (user) {
        if (first_Name) user.first_Name = first_Name;
        if (last_Name) user.last_Name = last_Name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (password) user.password = password;
        if (imgProf) user.imgProf = imgProf;
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
