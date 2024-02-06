import { Module, forwardRef } from '@nestjs/common';
import { EventReportsController } from './event-reports.controller';
import { EventReportsService } from './event-reports.service';
import { eventReportsProviders } from './event-reports.providers';
import { ActionableTasksModule } from 'src/actionable-tasks/actionable-tasks.module';
import { DatabaseModule } from 'src/database/database.module';
import { EventReportsRepository } from './event-reports.repository';
import { ActionableTasksRepository } from 'src/actionable-tasks/actionable-tasks.repository';
import { actionableTasksProviders } from 'src/actionable-tasks/actionable-tasks.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  imports: [forwardRef(() => ActionableTasksModule), DatabaseModule],
  controllers: [EventReportsController],
  providers: [
    EventReportsService,
    ...eventReportsProviders,
    EventReportsRepository,
    ...actionableTasksProviders,
    ActionableTasksRepository,
    ...databaseProviders,
  ],
  exports: [EventReportsService, EventReportsRepository],
})
export class EventReportsModule {}
