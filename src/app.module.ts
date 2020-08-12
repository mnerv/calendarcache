import { CalendarModel } from './database/calendar.model'
import path from 'path'
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common'
import { CalendarModule } from './calendar/calendar.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { GraphQLModule } from '@nestjs/graphql'

const ROOT_DIR = path.resolve()

@Module({
  imports: [
    CalendarModule,
    GraphQLModule.forRoot({
      debug: false,
      autoSchemaFile: path.join(ROOT_DIR, 'data', 'schema.gql'),
    }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: path.join(ROOT_DIR, 'data', 'calendars.sqlite'),
      logging: false,
      models: [CalendarModel],
      synchronize: true,
      sync: { alter: true },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
