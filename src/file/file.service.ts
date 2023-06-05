import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
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

  async createFiles(files: any) {
    // console.log(files);
    // const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));
    // const results = await Promise.all(uploadPromises);
    // return results;
    try {
      if (!Array.isArray(files)) {
        const uploadPromise = await cloudinary.uploader.upload(files.path, { folder: 'Upload' }, (error, result) => {
          if (error) {
            throw new Error(error.message);
          } else {
            return result
          }
        });
        this.deleteFiles(files);
        return uploadPromise.secure_url;
      } else {
        const uploadPromises =  files.map((file) => cloudinary.uploader.upload(file.path, { folder: 'Upload' }, (error, result) => {
          if (error) {
            throw new Error(error.message);
          } else {
            return result
          }
        }));
        const results = await Promise.all(uploadPromises);
        // Eliminar el archivo de la carpeta local
        this.deleteFiles(files);
        const URLS = results.map( (e) => e.secure_url);
        return URLS;
      }
    } catch (error) {
      throw new HttpException('Error al subir el archivo a claudinary', 404);
    }
  }

  deleteFiles(files: any) {
    try {
      if (!Array.isArray(files)) {
        unlink(files.path, (err) => {
          if (err) {
            throw new HttpException('Error al eliminar el archivo', 404);
          }
        });
      } else {
        for (const file of files) {
          unlink(file.path, (err) => {
            if (err) {
              throw new HttpException('Error al eliminar el archivo', 404);
            }
          });
        }
      }
    } catch (error) {
      throw new HttpException('Error al eliminar el archivo', 404);
    }
  }
}
