import { Controller, Get } from '@nestjs/common';

@Controller('')
export class RootController {
  @Get('/')
  async root() {
    return {
      status: 'OK',
      uptime: `${process.uptime()} seconds ago`,
    };
  }
}
