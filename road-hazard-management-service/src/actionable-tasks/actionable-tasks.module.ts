import { Module, forwardRef } from '@nestjs/common';
import { ActionableTasksController } from './actionable-tasks.controller';
import { ActionableTasksService } from './actionable-tasks.service';
import { actionableTasksProviders } from './actionable-tasks.providers';
import { ActionableTasksRepository } from './actionable-tasks.repository';
import { DatabaseModule } from 'src/database/database.module';
import { databaseProviders } from 'src/database/database.providers';
import { EventReportsModule } from 'src/event-reports/event-reports.module';

@Module({
  imports: [forwardRef(() => EventReportsModule), DatabaseModule],
  controllers: [ActionableTasksController],
  providers: [
    ActionableTasksService,
    ...actionableTasksProviders,
    ActionableTasksRepository,
    ...databaseProviders,
  ],
  exports: [ActionableTasksRepository, ActionableTasksService],
})
export class ActionableTasksModule {}
