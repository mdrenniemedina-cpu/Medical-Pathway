import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EVENT_BUS } from '@shared-kernel/application/event-bus.port';
import { InProcessEventBus } from './in-process-event-bus';
import { OutboxDispatcherService } from './outbox-dispatcher.service';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [{ provide: EVENT_BUS, useClass: InProcessEventBus }, OutboxDispatcherService],
  exports: [EVENT_BUS],
})
export class EventsModule {}
