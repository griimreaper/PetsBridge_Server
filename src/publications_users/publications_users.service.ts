import { Inject, Injectable } from '@nestjs/common';
import { Publications } from './entity/publications_users.entity';
import { CreatePublicationsDto } from './dto/publications_users.dto';

@Injectable()
export class PublicationsUsersService {
  constructor(
    @Inject('PUBLICACIONES_REPOSITORY') // Inyectamos los providers de publicaciones
    private servicePublications: typeof Publications,
  ) {}

  async findAll(): Promise<Publications[]> {
    //funcion para retornar todas las publicaciones
    const publications = await this.servicePublications.findAll();
    return publications;
  }

  async createUser(createUserDto: CreatePublicationsDto) {
    try {
      const newUser = await this.servicePublications.create({
        ...createUserDto,
      });
      return newUser;
    } catch (error) {
      throw new Error(
        `Error al intentar crear una nueva publicacion: ${error.message}`,
      );
    }
  }
}
