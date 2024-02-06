import { Injectable, Inject } from '@nestjs/common';
import { EventReport } from './entities/event-reports.entity';
import { Not, Repository } from 'typeorm';
import { IGetAllEvents } from './dto/get-all-events.dto';
import { ProcessFlagEnum } from 'src/common/constants';

@Injectable()
export class EventReportsRepository {
  constructor(
    @Inject('EVENT_REPORT_REPOSITORY')
    private eventReportRepository: Repository<EventReport>,
  ) {}

  async createEventReport(event: EventReport): Promise<EventReport> {
    return await this.eventReportRepository.save(event);
  }

  async findEventById(id: number): Promise<EventReport | null> {
    return await this.eventReportRepository.findOne({ where: { id } });
  }

  async update(event: EventReport): Promise<EventReport> {
    return await this.eventReportRepository.save(event);
  }

  async updateProcessFlag(id: number, processFlag: ProcessFlagEnum) {
    return await this.eventReportRepository.update(id, { processFlag });
  }

  async paginate(page: number = 1, take: number): Promise<IGetAllEvents> {
    const [events, total] = await this.eventReportRepository.findAndCount({
      where: {
        processFlag: Not(ProcessFlagEnum.Completed),
      },
      order: {
        createdTime: 'DESC',
      },
      take,
      skip: (page - 1) * take,
    });

    return {
      data: events,
      metaData: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }
}
