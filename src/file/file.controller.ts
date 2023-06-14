import { Controller, Post, UseInterceptors, UploadedFiles, Get, HttpException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { multerConfig } from '../file/multer.config';

@Controller('file')
export class FileController {
  constructor( private readonly fileService: FileService ) {}
  
  @Post()
  @UseInterceptors(
    FilesInterceptor('file', undefined, multerConfig),
  )
  async uploadFile(@UploadedFiles() files: any) {
    try {
      return await this.fileService.createFiles(files);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  @Get()
  all() {
    return 'Hola Mundo';
  }
}
