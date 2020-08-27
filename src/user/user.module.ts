import { UserEntity } from './../entity/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
