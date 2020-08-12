import { CalendarService } from './calendar.service'
import {
  Controller,
  Get,
  Param,
  Redirect,
  HttpStatus,
  CacheTTL,
  Res,
} from '@nestjs/common'
import { isString } from 'util'
import { Response } from 'express'

import path from 'path'

const ROOT_DIT = path.resolve()

@Controller('calendar')
export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  @Redirect()
  @Get()
  getHello() {
    return { statusCode: HttpStatus.PERMANENT_REDIRECT, url: 'calendar/all' }
  }

  @Get('all')
  async getCalendars() {
    return await this.service.getAll()
  }

  @Get(':name')
  @CacheTTL(10)
  async getCalendar(@Param('name') name: string, @Res() res: Response) {
    const result = await this.service.getCalendar(name.replace('.ics', ''))
    if (isString(result))
      return res.status(200).sendFile(path.join(ROOT_DIT, 'data/ics', result))
    else return result
  }

  // @Post('create')
  // createCalendar(@Query('name') name: string, @Body('link') link: string) {
  //   if (link)
  //     return this.service.create({
  //       name: name ? name : nanoid(),
  //       source_link: link,
  //     })
  //   else return { message: 'no link given' }
  // }

  // @Patch('edit/:id')
  // editCalendar(
  //   @Param('id') id: string,
  //   @Body('name') name: string,
  //   @Body('link') link: string
  // ) {
  //   return { message: `Edit calendar with id: ${id}` }
  // }

  // @Delete('delete/:id')
  // deletCalendar(@Param('id') id: string) {
  //   return { message: `Deleted ${id}` }
  // }
}
