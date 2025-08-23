import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private startTime: number;

  constructor(private readonly configService: ConfigService) {
    this.startTime = Date.now();
  }

  getHealth() {
    const uptime = (Date.now() - this.startTime) / 1000; // seconds
    
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: Number(uptime.toFixed(2)),
      environment: this.configService.get('NODE_ENV', 'development'),
    };
  }

  getUptime(): number {
    return (Date.now() - this.startTime) / 1000;
  }

  isHealthy(): boolean {
    return true; // MVP: always healthy
  }
}
