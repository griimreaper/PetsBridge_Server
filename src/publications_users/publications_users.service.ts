import { Inject, Injectable } from '@nestjs/common';
import { Publications } from './entity/publications_users.entity';
import { CreatePublicationsDto } from './dto/publications_users.dto';

@Injectable()
export class PublicationsUsersService {
  constructor(
    @Inject('PUBLICATIONS_REPOSITORY') // Inyectamos los providers de publicaciones
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

  async update(id: string, { title, description }): Promise<string> {
    if (!description && !title) return 'Nada que actualizar';
    const publicacion = await this.servicePublications.findByPk(parseInt(id));
    if (publicacion) {
      if (title) publicacion.title = title;
      if (description) publicacion.description = description;
      await publicacion.save();
      return 'Actualizado';
    } else {
      return 'No existe la publicacion';
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user = await this.servicePublications.findByPk(parseInt(id));

      if (!user) {
        throw new Error(`La publicacion con el ID '${id}' no se encuentra`);
      }
      await this.servicePublications.destroy({ where: { id: parseInt(id) } });
      return 'Eliminado';
    } catch (error) {
      throw new Error(
        `Error al intentar remover la publicacion: ${error.message}`,
      );
    }
  }
}
