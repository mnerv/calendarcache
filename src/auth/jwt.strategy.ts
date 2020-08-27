import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import config from 'src/config/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('token'),
      ignoreExpiration: false,
      secretOrKey: config.jwt_secret,
    })
  }

  async validate(payload: { sub: string; username: string }) {
    return payload
  }
}
