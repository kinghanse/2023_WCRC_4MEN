import { ActionableTask } from '../entities/actionable-tasks.entity';

export interface IGetAllTasks {
  data: ActionableTask[];
  metaData: {
    total: number;
    page: number;
    lastPages: number;
  };
}
