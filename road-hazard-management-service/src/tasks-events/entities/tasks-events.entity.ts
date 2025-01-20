import { ActionableTask } from 'src/actionable-tasks/entities/actionable-tasks.entity';
import { EventReport } from 'src/event-reports/entities/event-reports.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('events-to-tasks')
export class EventToTask {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @ManyToOne(
    () => ActionableTask,
    (actionableTask) => actionableTask.eventToTasks,
  )
  @JoinColumn({ name: 'actionable_task_id' })
  actionableTask: ActionableTask;

  @ManyToOne(() => EventReport, (eventReport) => eventReport.eventToTasks)
  @JoinColumn({ name: 'event_report_id' })
  eventReport: EventReport;
}
