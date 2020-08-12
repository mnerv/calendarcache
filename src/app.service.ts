import { Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {
    this.sequelize.sync({ force: false, alter: true })
  }

  getHello(): { message: string } {
    return { message: 'Hello, World!' }
  }
}
