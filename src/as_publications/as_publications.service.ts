import { Inject, Injectable } from '@nestjs/common';
import { AsPublication } from './entity/as_publications.entity';
import { AsPublicationDto } from './dto/as_publication.dto';

@Injectable()
export class AsPublicationsService {
  constructor(@Inject('AS_PUBLICATION_REPOSITORY') private readonly asPublicationRepository: typeof AsPublication) {}

  async postAdoption(post:AsPublicationDto):Promise<string> {
    try {
      const publication = await this.asPublicationRepository.create(post);
      return 'posted successfully';

    } catch (error) {
      console.log(error.message);
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

  async findPostByPK(idPost:string):Promise<AsPublication> {
    try {
      const publication = await this.asPublicationRepository.findByPk(idPost);
      return publication;
    } catch (error) {
      console.log(error.message);
    }
  }
}