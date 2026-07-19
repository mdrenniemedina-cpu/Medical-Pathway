import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PinoLoggerService } from './pino-logger.service';

@Module({
  controllers: [HealthController],
  providers: [PinoLoggerService],
  exports: [PinoLoggerService],
})
export class ObservabilityModule {}
