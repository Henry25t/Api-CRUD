import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule, } from '@nestjs/jwt';
import { jwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    PassportModule,
  JwtModule.register({
    secret: "SECRET",
    signOptions: { expiresIn: "24h" }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
