import { JwtStrategy } from './jwt.strategy'
import config from 'src/config/config'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.strategy'
import { UserModule } from './../user/user.module'
import { AuthService } from './auth.service'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt_secret,
      signOptions: {
        expiresIn: config.jwt_expire,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
