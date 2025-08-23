import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean', example: true },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 123.45 },
        environment: { type: 'string', example: 'development' }
      }
    }
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}
