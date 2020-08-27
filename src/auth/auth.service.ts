import { UserEntity } from './../entity/user.entity'
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    return await UserEntity.findOne({
      where: { username },
    }).then(async (reply) => {
      if (reply)
        if (await bcrypt.compare(password, reply.password)) {
          return {
            sub: reply.id.toString(),
            username: reply.username,
          }
        } else throw new UnauthorizedException('wrong password')
      throw new NotFoundException('user not found')
    })
  }

  async login(payload: { username: string; sub: string }) {
    return {
      acess_token: this.jwtService.sign(payload),
    }
  }
}
