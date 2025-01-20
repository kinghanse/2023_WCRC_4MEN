import { DataSource } from 'typeorm';
import { ActionableTask } from './entities/actionable-tasks.entity';

export const actionableTasksProviders = [
  {
    provide: 'ACTIONABLE_TASK_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActionableTask),
    inject: ['DATA_SOURCE'],
  },
];
