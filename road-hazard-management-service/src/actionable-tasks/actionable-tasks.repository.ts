import { Injectable, Inject } from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ActionableTask } from 'src/actionable-tasks/entities/actionable-tasks.entity';
import { ProcessFlagEnum } from 'src/common/constants';
import { IGetAllEvents } from 'src/event-reports/dto/get-all-events.dto';
import { IGetAllTasks } from './dto/get-all-tasks.dto';

@Injectable()
export class ActionableTasksRepository {
  constructor(
    @Inject('ACTIONABLE_TASK_REPOSITORY')
    private actionableTaskRepository: Repository<ActionableTask>,
  ) {}

  async findWaitingTasksWithCategoryAndEventCnt(
    category: string,
  ): Promise<ActionableTask[]> {
    return await this.actionableTaskRepository.find({
      where: {
        processFlag: ProcessFlagEnum.Waiting,
        category: category,
        eventCnt: LessThan(4),
      },
      relations: {
        eventToTasks: true,
      },
    });
  }

  async update(task: ActionableTask): Promise<void> {
    await this.actionableTaskRepository.save(task);
    return;
  }

  async updateProcessFlag(
    id: number,
    processFlag: ProcessFlagEnum,
  ): Promise<void> {
    await this.actionableTaskRepository.update(id, { processFlag });
    return;
  }

  async createActionableTask(task: ActionableTask): Promise<ActionableTask> {
    return await this.actionableTaskRepository.save(task);
  }

  async findTaskByIdWithEvents(id: number): Promise<ActionableTask | null> {
    return await this.actionableTaskRepository.findOne({
      where: { id },
      relations: ['eventToTasks.eventReport'],
    });
  }

  async paginate(page: number = 1, take: number): Promise<IGetAllTasks> {
    const [tasks, total] = await this.actionableTaskRepository.findAndCount({
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
      data: tasks,
      metaData: {
        total,
        page,
        lastPages: Math.ceil(total / take),
      },
    };
  }
}
