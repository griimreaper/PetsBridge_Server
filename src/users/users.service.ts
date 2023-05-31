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
}
