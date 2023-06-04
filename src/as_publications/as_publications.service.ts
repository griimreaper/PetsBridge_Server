import { Inject, Injectable } from '@nestjs/common';
import { AsPublication } from './entity/as_publications.entity';
import { AsPublicationDto } from './dto/as_publication.dto';
import { LikeDto } from './dto/likes_publications.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class AsPublicationsService {
  constructor(
    @Inject('AS_PUBLICATION_REPOSITORY') private readonly asPublicationRepository: typeof AsPublication, 
    private readonly fileService: FileService) {}

  async postAdoption(post:AsPublicationDto, file:Express.Multer.File[]):Promise<string> {
    try {
      const date = new Date();
      const easyFormatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}`;
      let urls:string[] | null;
      if (!file.length) urls = null;
      urls = await this.fileService.createFiles(file);

      
      const publication = await this.asPublicationRepository.create({ ...post, createdAt:easyFormatDate, images:urls });

      return 'posted successfully';

    } catch (error) {
      console.log(error.message);
    }  
  }

  async getAllPosts():Promise<AsPublication[]> {
    try {
      const publications = await this.asPublicationRepository.findAll();
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
}