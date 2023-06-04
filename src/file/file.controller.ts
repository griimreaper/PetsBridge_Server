import { Controller, Post, UseInterceptors, UploadedFiles, Get } from '@nestjs/common';
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
      throw new Error(error.message);
    }
  }

  @Get()
  all() {
    return 'Hola Mundo';
  }
}
