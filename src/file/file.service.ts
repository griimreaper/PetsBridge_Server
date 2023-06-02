import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import { unlink } from 'fs';
import { Imagen } from './Entity/Imagen.entity';
dotenvConfig();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
@Injectable()
export class FileService {

  constructor(
    @Inject('IMAGENES_REPOSITORY')
    private imagenesProviders: typeof Imagen,
  ) {}

  async createFiles(files: Express.Multer.File[]) {
    // console.log(files);
    // const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));
    // const results = await Promise.all(uploadPromises);
    // return results;

    try {
      const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path, { folder: 'Upload' }, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.log(result);
        }
      }));
      const results = await Promise.all(uploadPromises);
      // Eliminar el archivo de la carpeta local
      for (const file of files) {
        unlink(file.path, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        });
      }
      const URLS = results.map( (e) => e.secure_url);
      console.log(URLS);
      URLS.forEach(async element => {
        await this.imagenesProviders.create({
          urls: URLS,
        });       
      });
      return results;
    } catch (error) {
      console.error('Error al subir el archivo a Cloudinary:', error);
      throw error;
    }
  }
}
