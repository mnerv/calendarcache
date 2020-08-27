import { MinLength } from 'class-validator'

export class UserLoginDTO {
  @MinLength(3)
  username!: string

  @MinLength(6)
  password!: string
}
