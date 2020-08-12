import { CalendarResolver } from './calendar.resolver'
import { CalendarModel } from './../database/calendar.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { CalendarService } from './calendar.service'
import { CalendarController } from './calendar.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [SequelizeModule.forFeature([CalendarModel])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarResolver],
})
export class CalendarModule {}
