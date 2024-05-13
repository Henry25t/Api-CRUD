import { Module, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Role } from 'src/roles/entities/role.entity';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Role])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
