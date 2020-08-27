import { JwtAuthGuard } from './../auth/jwt-auth.guard'
import { RequestLogService } from './requestlog.service'
import { CalendarDTO } from 'src/models/calendar.dto'
import { ROOT_DIR } from 'src/config/config'
import { CalendarService } from './calendar.service'
import {
  Controller,
  Get,
  Param,
  Redirect,
  HttpStatus,
  Res,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import path from 'path'

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly service: CalendarService,
    private readonly logService: RequestLogService
  ) {}

  @Redirect()
  @Get()
  getHello() {
    return { statusCode: HttpStatus.PERMANENT_REDIRECT, url: 'calendar/all' }
  }

  @Get('all')
  async getCalendars() {
    return await this.service.findAll()
  }

  @Get(':name')
  async getCalendar(@Param('name') name: string, @Res() res: Response) {
    const result = await this.service.getCalendar(name.replace('.ics', ''))
    if (result)
      res
        .status(200)
        .sendFile(path.join(ROOT_DIR, 'data/ics', result.ics_filename))
    else res.sendStatus(404)
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCalendar(@Body() input: CalendarDTO) {
    return await this.service.create(input)
  }

  @Get('api/requests/:id')
  async getRequestLogs(@Param('id') id: string) {
    return await this.logService.findAll(id)
  }
}
