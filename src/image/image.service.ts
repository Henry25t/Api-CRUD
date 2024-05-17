import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './entities/image.entity';
import { ok } from 'assert';
import { renameImage } from './helpers/image-helpers';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) { }

  async create(createImageDto: CreateImageDto){
    try {
      const { filename } = createImageDto;
      const image = new Image;
      image.filename = filename;

      await this.imageRepository.save(image);
      return{
        ok: true,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      return{
        ok: false,
        message: "Ocurrio un error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findAll() {
    try {
      const images = await this.imageRepository.find()
      return {
        ok: true,
        images,
        status: HttpStatus.OK
      }
    } catch (error) {
      return {
        ok: false,
        message: "Error en el servidor",
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
