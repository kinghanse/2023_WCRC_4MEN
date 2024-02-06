import { ProcessFlagEnum, SafetyLevelEnum } from 'src/common/constants';
import { EventToTask } from 'src/tasks-events/entities/tasks-events.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('event_reports')
export class EventReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  sourceId: string;

  @Column({ length: 255 })
  category: string;

  @Column()
  level: SafetyLevelEnum;

  @Column({ length: 255, nullable: true })
  imageName: string;

  @Column()
  processFlag: ProcessFlagEnum;

  @Column()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @Column({ length: 255 })
  version!: string;

  @Column({ type: 'double precision' })
  x: number;

  @Column({ type: 'double precision' })
  y: number;

  @OneToMany(() => EventToTask, (eventToTask) => eventToTask.eventReport, {
    cascade: true,
  })
  eventToTasks: EventToTask[];
}
