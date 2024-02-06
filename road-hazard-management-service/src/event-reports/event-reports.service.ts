import { ActionableTasksRepository } from './../actionable-tasks/actionable-tasks.repository';
import { EventReportsRepository } from './event-reports.repository';
import { Inject, Injectable } from '@nestjs/common';
import { IEvent } from './dto';
import { ActionableTask } from 'src/actionable-tasks/entities/actionable-tasks.entity';
import typia from 'typia';
import { EventReport } from './entities/event-reports.entity';
import { ProcessFlagEnum } from 'src/common/constants';
import { EventToTask } from 'src/tasks-events/entities/tasks-events.entity';
import { IGetAllEvents } from './dto/get-all-events.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class EventReportsService {
  constructor(
    private readonly eventReportsRepository: EventReportsRepository,
    private readonly actionableTasksRepository: ActionableTasksRepository,
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  async createEventAndUpdateTask(eventDto: IEvent): Promise<IEvent> {
    const validationEvent = typia.assert<IEvent>(eventDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const foundTasks =
        await this.actionableTasksRepository.findWaitingTasksWithCategoryAndEventCnt(
          validationEvent.category,
        );
      const nearTasks = foundTasks.filter(
        (_) =>
          this.calculateDistance(
            _.avgPointX,
            _.avgPointY,
            eventDto.x,
            eventDto.y,
          ) < 4,
      );

      const newEvent = new EventReport();
      newEvent.category = validationEvent.category;
      newEvent.createdTime = new Date(validationEvent.created_time);
      newEvent.imageName = validationEvent.image_name ?? null;
      newEvent.level = validationEvent.level;
      newEvent.x = validationEvent.x;
      newEvent.y = validationEvent.y;
      newEvent.processFlag = ProcessFlagEnum.Waiting;
      newEvent.sourceId = validationEvent.source_id;
      newEvent.updatedTime = new Date(validationEvent.created_time);
      newEvent.version = 'test';

      const savedEvent =
        await this.eventReportsRepository.createEventReport(newEvent);

      /** 가까운 Task 유무에 따른 task insert or update 분기처리*/
      if (nearTasks.length > 0) {
        for (const task of nearTasks) {
          const avgPoint = this.findMidpoint(
            task.avgPointX,
            task.avgPointY,
            eventDto.x,
            eventDto.y,
          );
          task.eventCnt += 1;
          task.avgPointX = avgPoint.x;
          task.avgPointY = avgPoint.y;
          task.processFlag =
            task.eventCnt < 3
              ? ProcessFlagEnum.Waiting
              : ProcessFlagEnum.ToBeVerified;

          const eventToTask = new EventToTask();
          eventToTask.eventReport = savedEvent;

          task.eventToTasks.push(eventToTask);

          await this.actionableTasksRepository.update(task);

          if (task.processFlag !== ProcessFlagEnum.Waiting) {
            const updatedTask =
              await this.actionableTasksRepository.findTaskByIdWithEvents(
                task.id,
              );
            if (!updatedTask) {
              continue;
            }
            for (const eventToTasks of updatedTask.eventToTasks) {
              const eventReport =
                await this.eventReportsRepository.findEventById(
                  eventToTasks.eventReport.id,
                );
              if (eventReport) {
                eventReport.processFlag = task.processFlag;
                await this.eventReportsRepository.update(eventReport);
              }
            }
          }
        }
      } else {
        const newTask = new ActionableTask();
        newTask.eventCnt = 1;
        newTask.category = newEvent.category;
        newTask.avgPointX = validationEvent.x;
        newTask.avgPointY = validationEvent.y;
        newTask.processFlag = ProcessFlagEnum.Waiting;
        newTask.version = 'test';

        const eventToTask = new EventToTask();
        eventToTask.eventReport = savedEvent;
        eventToTask.actionableTask = newTask;

        newTask.eventToTasks = [eventToTask];

        await this.actionableTasksRepository.createActionableTask(newTask);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return eventDto;
  }

  calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    return distance;
  }
  findMidpoint(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): { x: number; y: number } {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return { x: midX, y: midY };
  }

  async getAllEventsByPayginate(
    page: number,
    take: number,
  ): Promise<IGetAllEvents> {
    return this.eventReportsRepository.paginate(page, take);
  }
}
