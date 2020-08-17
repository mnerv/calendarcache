import { RequestLogService } from './requestlog.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CalendarResolver } from './calendar.resolver'
import { CalendarService } from './calendar.service'
import { CalendarController } from './calendar.controller'
import { Module } from '@nestjs/common'
import CalendarEntity from 'src/entity/calendar.entity'
import CalendarRequestLogsEntity from 'src/entity/calendar-activity.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity, CalendarRequestLogsEntity]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService, RequestLogService, CalendarResolver],
})
export class CalendarModule {}
