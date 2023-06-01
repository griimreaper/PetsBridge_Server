import { Controller, Post, UseInterceptors, UploadedFiles, Get } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
// import { multerConfig } from '../file/multer.config';
import { diskStorage } from 'multer';
@Controller('file')
export class FileController {
  constructor( private readonly fileService: FileService ) {}
  
  @Post()
  @UseInterceptors(
    FilesInterceptor('file', undefined),
  )
  async uploadFile(@UploadedFiles() files: Express.Multer.File | Express.Multer.File[]) {
    console.log(files);
    try {
      return await this.fileService.createFiles(files);
    } catch (error) {
      return console.error(error);
    }
  }

  @Get()
  all() {
    return 'Hola Mundo';
  }
}
