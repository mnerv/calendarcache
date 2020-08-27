import { UserService } from './../user/user.service'
import { UserLoginDTO } from './../models/user.dto'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common'
import { verifyJWTToken } from 'src/config/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('create')
  async create(
    @Query('token') token: string,
    @Body(new ValidationPipe({ transform: true })) userData: UserLoginDTO
  ) {
    if (token && (await verifyJWTToken(token)).role === 'admin') {
      return this.userService.create(userData)
    }

    throw new UnauthorizedException()
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user as { username: string; sub: string })
  }
}
