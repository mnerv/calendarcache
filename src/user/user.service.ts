import { UserEntity } from './../entity/user.entity'
import { UserLoginDTO } from './../models/user.dto'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import bcrypt from 'bcrypt'
import config from 'src/config/config'

@Injectable()
export class UserService {
  async create(data: UserLoginDTO) {
    const newUser = new UserEntity()
    newUser.username = data.username
    return await bcrypt
      .hash(data.password, config.salt)
      .then(async (value) => {
        newUser.password = value
        await newUser.save()
        return { message: `user: ${newUser.username} created` }
      })
      .catch((err) => {
        throw new InternalServerErrorException('Error creating user')
      })
  }
}
