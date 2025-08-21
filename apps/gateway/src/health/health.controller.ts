import { Controller, Get } from '@nestjs/common';

@Controller('helath')
export class HealthController {
  @Get()
  checkHealth() {
    return true;
  }
}
