import { Inject, Injectable } from '@nestjs/common';
import { Publications } from './entity/publications_users.entity';
import { CreatePublicationsDto } from './dto/publications_users.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PublicationsUsersService {
  constructor(
    @Inject('PUBLICATIONS_REPOSITORY') // Inyectamos los providers de publicaciones
    private servicePublications: typeof Publications,
    private readonly fileService: FileService,
  ) {}

  async findAll(): Promise<Publications[]> {
    //funcion para retornar todas las publicaciones
    const publications = await this.servicePublications.findAll();
    return publications;
  }

  async findOne(id: string): Promise<Publications[]> {
    const publications = await this.servicePublications.findAll({
      where:{
        userId: id,
      },
    });
    return publications;
  }

  async createUser(createUserDto: CreatePublicationsDto, file: Express.Multer.File[]) {
    try {
      if ( file.length ) {
        const URLS = await this.fileService.createFiles(file);
        createUserDto.imagen = URLS;
      }
      
      const date = new Date();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const allDate = year + '/' + month + '/' + day + '/' + hour  + ':' + minutes;

      const newUser = await this.servicePublications.create({
        ...createUserDto,
        datePublication: allDate,
        likes: 0,
        isActive: false,
      });
      return newUser;
    } catch (error) {
      throw new Error(
        `Error al intentar crear una nueva publicacion: ${error.message}`,
      );
    }
  }

  async updateLike(like: CreatePublicationsDto) {
    const publicacion = await this.servicePublications.findByPk(like.id);
    if (!publicacion) {
      return 'Esta publicacion no existe';
    }
    if (like.like) {
      publicacion.likes = publicacion.likes + 1;
    } else {
      publicacion.likes = publicacion.likes - 1;
    }
    await publicacion.save();
    return publicacion;
  }

  async update(id: string, { description }): Promise<string> {
    if (!description) return 'Nada que actualizar';
    const publicacion = await this.servicePublications.findByPk(parseInt(id));
    if (publicacion) {
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
