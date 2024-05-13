import { Body, Controller, HttpCode, Post, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/auth-login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }
}