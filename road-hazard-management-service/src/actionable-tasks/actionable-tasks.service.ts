import { EventReportsRepository } from './../event-reports/event-reports.repository';
import { ActionableTasksRepository } from 'src/actionable-tasks/actionable-tasks.repository';
import { Inject, Injectable } from '@nestjs/common';
import { IGetAllTasks } from './dto/get-all-tasks.dto';
import { ProcessFlagEnum } from 'src/common/constants';
import { DataSource } from 'typeorm';

@Injectable()
export class ActionableTasksService {
  constructor(
    private readonly actionableTasksRepository: ActionableTasksRepository,
    private readonly eventReportsRepository: EventReportsRepository,
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  getAllTasksByPayginate(
    page: number = 1,
    take: number,
  ): Promise<IGetAllTasks> {
    return this.actionableTasksRepository.paginate(page, take);
  }

  async updateProcessFlag(id: number, processFlag: ProcessFlagEnum) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.actionableTasksRepository.updateProcessFlag(
        id,
        processFlag,
      );
      const events =
        await this.actionableTasksRepository.findTaskByIdWithEvents(id);
      if (events) {
        for (const event of events.eventToTasks) {
          await this.eventReportsRepository.updateProcessFlag(
            event.id,
            processFlag,
          );
        }
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllDetails(id: number) {
    const result =
      await this.actionableTasksRepository.findTaskByIdWithEvents(id);
    return result ?? [];
  }
}
