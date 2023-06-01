import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
import { unlink } from 'fs';
dotenvConfig();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
@Injectable()
export class FileService {
  async createFiles(files: Express.Multer.File[]) {
    // console.log(files);
    // const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));
    // const results = await Promise.all(uploadPromises);
    // return results;

    try {
      const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));
      const results = await Promise.all(uploadPromises);
      // Eliminar el archivo de la carpeta local
      for (const file of files) {
        unlink(file.path, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        });
      }
      return results;
    } catch (error) {
      console.error('Error al subir el archivo a Cloudinary:', error);
      throw error;
    }
  }
}
