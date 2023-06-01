import { Controller, Post, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {

  constructor( private readonly fileService: FileService ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    
    try {
      return await this.fileService.createFile(file);
    } catch (error) {
      return console.error(error);
    }
  }

  @Get()
  all() {
    return 'Hola Mundo';
  }
}
