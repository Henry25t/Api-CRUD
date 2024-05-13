import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {  SaveUsers } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user-dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(jwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() saveUsers: SaveUsers) {
    return this.usersService.create(saveUsers);
  }

  @Get()
  findAll(@Query() searchUserDto : SearchUserDto) {
    return this.usersService.findAll(searchUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() saveUsers: SaveUsers) {
    return this.usersService.update(+id, saveUsers);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
