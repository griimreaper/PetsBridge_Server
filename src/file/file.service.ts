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
  async createFile(file) {
    console.log(file);
    const result = await cloudinary.uploader.upload(file.path);
    return result;
  }
}
