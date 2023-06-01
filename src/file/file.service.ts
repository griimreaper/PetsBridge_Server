import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
@Injectable()
export class FileService {
  async createFiles(files: Express.Multer.File | Express.Multer.File[]) {
    if (Array.isArray(files) ) {
      const uploadPromises = files.map((file) => cloudinary.uploader.upload(file.path));
      const results = await Promise.all(uploadPromises);
      return results;
    } else {
      const results = await cloudinary.uploader.upload(files.path);
      return results;
    }
  }
}
