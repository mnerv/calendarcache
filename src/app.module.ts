import path from 'path'
import { Module } from '@nestjs/common'
import { CalendarModule } from './calendar/calendar.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ROOT_DIR } from 'src/config/config'

@Module({
  imports: [
    CalendarModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(ROOT_DIR, 'data', 'calendars.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
    }),
    GraphQLModule.forRoot({
      debug: false,
      autoSchemaFile: path.join(ROOT_DIR, 'data', 'schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
