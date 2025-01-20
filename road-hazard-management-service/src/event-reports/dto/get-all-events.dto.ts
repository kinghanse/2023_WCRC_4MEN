import { EventReport } from '../entities/event-reports.entity';

export interface IGetAllEvents {
  data: EventReport[];
  metaData: {
    total: number;
    page: number;
    lastPage: number;
  };
}
