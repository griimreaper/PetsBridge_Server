import { Inject, Injectable } from '@nestjs/common';
import { AsPublication } from './entity/as_publications.entity';
import { AsPublicationDto } from './dto/as_publication.dto';
import { LikeDto } from './dto/likes_publications.dto';
import { FileService } from 'src/file/file.service';
import { Animal } from 'src/animals/animals.entity';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Comments } from 'src/coments/entity/comments.entity';
import { CreateCommentDto } from 'src/coments/comments.dto';
import { Op } from 'sequelize';

@Injectable()
export class AsPublicationsService {
  constructor(
    @Inject('AS_PUBLICATION_REPOSITORY') private readonly asPublicationRepository: typeof AsPublication,
    @Inject('COMMENTS_REPOSITORY') private readonly commentsRepository: typeof Comments,
    private readonly fileService: FileService) {}

  async postAdoption(post:AsPublicationDto, file:Express.Multer.File[]):Promise<string> {
    try {
      const date = new Date();
      const easyFormatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}`;
      let urls:string | string[];
      if (!file.length) urls = null;
      urls = await this.fileService.createFiles(file);

      
      const publication = await this.asPublicationRepository.create({ ...post, createdAt:easyFormatDate, image:urls });

      return 'posted successfully';

    } catch (error) {
      console.log(error.message);
    }  
  }

  async getAllPosts():Promise<AsPublication[]> {
    try {
      const publications = await this.asPublicationRepository.findAll({
        include:[Animal, Asociaciones, Comments],
      });
      return publications;
    } catch (error) {
      console.log(error);
    }
  }

  async getPostsByAso(idAsociation:string):Promise<string | AsPublication[]> {
    try {
      const publications = await this.asPublicationRepository.findAll({
        where:{
          ID_Asociation:idAsociation,
        },
      });

      return publications.length ? publications : 'No se encontraron publicaciones para esta asociacion';

    } catch (error) {
      console.log(error.message);
    }
  }

  async deletePublication(id:number):Promise<string> {
    try {
      const publication = await this.asPublicationRepository.findByPk(id);
      publication.destroy();
      return 'Deleted post successfully';
    } catch (error) {
      console.log(error.message);
    }
  }

  async findPostByPK(idPost:number):Promise<AsPublication> {
    try {
      const publication = await this.asPublicationRepository.findByPk(idPost);
      return publication;
    } catch (error) {
      console.log(error.message);
    }
  }

  async giveLike(like:LikeDto):Promise<string | AsPublication> {
    try {
      const publication = await this.asPublicationRepository.findByPk(like.publicationId);
      if (!publication) return 'Esta publicacion no existe';

      if (like.likeOrDislike) {
        publication.likes = publication.likes + 1;
      } else {
        publication.likes = publication.likes - 1;
      }
      await publication.save();
      return publication;

    } catch (error) {
      console.log(error.message);
    }
  }

  async comment(comment:CreateCommentDto):Promise<Comments | string> {
    try {
      if (!comment.description.length) return 'Can`t make an empty comment';
      const { userId, pubId, asPubId, description } = comment;
      if (pubId) {
        const com = await this.commentsRepository.create<Comments>({ userId, asPubId, description });
        return com;
      } else if (asPubId) {
        const com = await this.commentsRepository.create<Comments>({ userId, pubId, description });
        return com;
      }
      throw Error('Request Error');
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteComment(id:string):Promise<string> {
    try {
      const comment = await this.asPublicationRepository.findByPk(id);
      comment.destroy();
      return 'deleted successfully';
    } catch (error) {
      
    }
  }

  async updateComment(newCommentData:CreateCommentDto):Promise<number[]> {
    try {
      const { userId, pubId, asPubId } = newCommentData;
      const newComment = await this.commentsRepository.update(newCommentData, {
        where:{
          userId:userId,
          [Op.or]:[{ pubId:pubId }, { asPubId:asPubId }],
        },
      });
      return newComment;
    } catch (error) {
      console.log(error.message);
    }
  }
}