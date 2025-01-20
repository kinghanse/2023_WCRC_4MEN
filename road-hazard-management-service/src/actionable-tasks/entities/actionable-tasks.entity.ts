import { ProcessFlagEnum } from 'src/common/constants';
import { EventToTask } from 'src/tasks-events/entities/tasks-events.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('actionable_tasks')
export class ActionableTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'avg_point_x', type: 'double precision' })
  avgPointX: number;

  @Column({ name: 'avg_point_y', type: 'double precision' })
  avgPointY: number;

  @Column({ length: 255 })
  category: string;

  @Column({ name: 'event_cnt' })
  eventCnt: number;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime: Date;

  @Column({ name: 'process_flag' })
  processFlag: ProcessFlagEnum;

  @Column({ length: 255 })
  version: string;

  @OneToMany(() => EventToTask, (eventToTask) => eventToTask.actionableTask, {
    cascade: true,
  })
  eventToTasks: EventToTask[];
}
