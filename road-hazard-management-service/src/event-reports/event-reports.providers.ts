import { DataSource } from 'typeorm';
import { EventReport } from './entities/event-reports.entity';

export const eventReportsProviders = [
  {
    provide: 'EVENT_REPORT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EventReport),
    inject: ['DATA_SOURCE'],
  },
];
