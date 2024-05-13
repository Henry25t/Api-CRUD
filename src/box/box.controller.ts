import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BoxService } from './box.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Box')
@UseGuards(jwtAuthGuard)
@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  create(@Body() createBoxDto: CreateBoxDto) {
    return this.boxService.create(createBoxDto);
  }

  @Get()
  findAll() {
    return this.boxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    return this.boxService.update(+id, updateBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boxService.remove(+id);
  }
}
