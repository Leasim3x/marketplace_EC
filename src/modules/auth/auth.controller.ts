import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }


  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  getPerfil(@Request() req) {
    return req.user;
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

}
