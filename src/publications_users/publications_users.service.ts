import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Publications } from './entity/publications_users.entity';
import { CreatePublicationsDto } from './dto/publications_users.dto';
import { FileService } from '../file/file.service';
import { Comments } from '../coments/entity/comments.entity';
import { CreateCommentDto } from '../coments/comments.dto';
import { Users } from '../users/entity/users.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';

@Injectable()
export class PublicationsUsersService {
  constructor(
    @Inject('PUBLICATIONS_REPOSITORY') // Inyectamos los providers de publicaciones
    private servicePublications: typeof Publications,
    private readonly fileService: FileService,
    @Inject('COMMENTS_REPOSITORY')
    private comments: typeof Comments,
  ) {}

  async findAll(rol: string): Promise<Publications[]> {
    //funcion para retornar todas las publicaciones
    let publications: any;
    if (rol === 'admin') {
      publications = await this.servicePublications.findAll({
        include: [Comments, Users, Asociaciones],
      });
    } else {
      publications = await this.servicePublications.findAll({
        where: { isActive: true },
        include: [Comments, Users, Asociaciones],
      });
    }
    const comentarys = await this.comments.findAll({
      include: [Users, Asociaciones],
    });
    const newPub = publications.map((e) => {
      const filtUser: Users = e.dataValues.user;
      const filtAsoc: Asociaciones = e.dataValues.asociacion;
      const filtro = e.dataValues.comments.map((x) => x.dataValues);
      const filtComent = comentarys.map((x) => x.dataValues);
      const filtComentUsers = filtComent.map((x) => x.commentsUser ? {
        email: x.commentsUser.email,
        firstName: x.commentsUser.firstName,
        lastName: x.commentsUser.lastName,
        image: x.commentsUser.image,
      } : {
        email: x.commentsAsoc.email,
        firstName: x.commentsAsoc.nameOfFoundation,
        image: x.commentsAsoc.image,
      },
      );
      let filtDataComUser: any;

      if (filtComentUsers) {
        filtDataComUser = filtComentUsers.map((x) => {
          const dataUser = {
            email: x.email,
            firstName: x.firstName,
            lastName: x.lastName,
            imgProf: x.image,
          };
          return dataUser;
        });
      }

      if (filtUser) {
        const { firstName, lastName, image, email } = filtUser;
        const filtro2 = filtro.map(({ pubId, ...commentarios }, i: number) => {
          const combinar = { ...commentarios, ...filtDataComUser[i] };
          return combinar;
        });
        return {
          ...e.dataValues,
          comments: filtro2,
          user: { firstName, lastName, image, email },
        };
      }

      if (filtAsoc) {
        const { nameOfFoundation, image, email } = filtAsoc;
        const filtro2 = filtro.map(({ pubId, ...commentarios }, i: number) => {
          const combinar = { ...commentarios, ...filtDataComUser[i] };
          return combinar;
        });
        return {
          ...e.dataValues,
          comments: filtro2,
          user: { firstName: nameOfFoundation, image, email },
          asociacion: null,
        };
      }
    });
    const sortedPublications = newPub.sort((a, b) => {
      const dateA = new Date(a.datePublication);
      const dateB = new Date(b.datePublication);
      return dateB.getTime() - dateA.getTime();
    });
    
    
    return sortedPublications;
  }

  async findOne(id: string): Promise<Publications[]> {
    try {
      const publications = await this.servicePublications.findAll({
        where: {
          id,
        },
        include: Comments,
      });
      const newPub = publications.map((e) => {
        const filtro = e.dataValues.comments.map((x) => x.dataValues);
        const filtro2 = filtro.map(
          ({ pubId, ...commentarios }) => commentarios,
        );
        return {
          ...e.dataValues,
          comments: filtro2,
        };
      });
      return newPub;
    } catch (error) {
      throw new HttpException('Error al buscar las publicaciones', 404);
    }
  }

  async createPub(
    createUserDto: CreatePublicationsDto,
    file: Express.Multer.File[],
  ) {
    try {
      if (file.length) {
        const URLS = await this.fileService.createFiles(file);
        createUserDto.imagen = URLS;
      }

      const date = new Date();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const allDate =
        year + '/' + month + '/' + day + '/' + hour + ':' + minutes;

      const newUser = await this.servicePublications.create({
        ...createUserDto,
        datePublication: allDate,
        likes: 0,
        isActive: true,
      });
      return newUser;
    } catch (error) {
      throw new HttpException(
        'Error al intentar crear una nueva publicacion',
        404,
      );
    }
  }

  async comment(newComment: CreateCommentDto) {
    try {
      if (!newComment.description) {
        throw new HttpException('No puede enviar un comentario vacio', 404);
      }
      const addComment = await this.comments.create({
        ...newComment,
      });
      return addComment;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error al añadir comentario', 404);
    }
  }

  async updateComment(user: any, id: string, { description }) {
    try {
      const comentario = await this.comments.findByPk(id);

      if (!comentario)
        throw new HttpException('Este comentario no existe', 400);
      if (user.sub !== comentario.userId && user.rol === 'user')
        throw new HttpException('Forbidden resource', 403);
      if (user.sub !== comentario.asocId && user.rol === 'fundation')
        throw new HttpException('Forbidden resource', 403);
      if (!description) throw new HttpException('Nada que actualizar', 400);

      if (description) comentario.description = description;
      await comentario.save();

      return comentario;
    } catch (error) {
      throw new HttpException('Forbiden resource', 403);
    }
  }

  async deleteComment(user: any, id: string) {
    try {
      const comentario = await this.comments.findByPk(id);
      const publicacion = await this.servicePublications.findByPk(
        comentario.pubId,
      );

      if (!comentario)
        throw new HttpException('Este comentario no existe', 400);
      if (!publicacion)
        throw new HttpException('Esta publicacion no existe', 400);

      if (user.sub === publicacion.userId || user.sub === publicacion.asocId
        || user.sub === comentario.userId || user.sub === comentario.asocId
        || user.rol === 'admin'
      ) {
        await this.comments.destroy({ where: { id } });
        return 'Comentario eliminado';
      }

      throw new HttpException('Forbidden resource', 403);
    } catch (error) {
      throw new HttpException(error.message, 403);
    }
  }

  async updateLike(like: CreatePublicationsDto) {
    try {
      const publicacion = await this.servicePublications.findByPk(like.id);
      if (!publicacion) {
        throw new HttpException('No existe la publicacion', 404);
      }
      if (like.like) {
        publicacion.likes = publicacion.likes + 1;
      } else {
        publicacion.likes = publicacion.likes - 1;
      }
      await publicacion.save();
      return publicacion;
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el like de la publicacion',
        404,
      );
    }
  }

  async update(id: string, body: CreatePublicationsDto): Promise<string> {
    const { description } = body;
    try {
      if (!description) {
        return 'Nada que actualizar';
      }
      const publicacion = await this.servicePublications.findByPk(id);
      if (publicacion) {
        if (description) {
          publicacion.description = description;
        }
        await publicacion.save();
        return 'Actualizado';
      } else {
        throw new HttpException('No existe la publicacion', 404);
      }
    } catch (error) {
      throw new HttpException('Error al actualizar la publicacion', 404);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const publication = await this.servicePublications.findByPk(id);

      if (!publication) {
        throw new HttpException('No se encuentra la publicacion', 404);
      }

      publication.isActive = false;
      await publication.save();

      return 'Eliminado';
    } catch (error) {
      throw new HttpException('Error al intentar remover la publicacion', 404);
    }
  }
}
