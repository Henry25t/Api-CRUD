import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { fileFilter, renameImage } from './helpers/image-helpers';

@Controller('image')
export class ImageController {

  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const createImageDto: CreateImageDto = {
      filename: file.originalname,
    };
    await this.imageService.create(createImageDto);
  }

  @Get()
  findAll(@Param()createImageDto : CreateImageDto) {
    return this.imageService.findAll();
  }
}
