import { ActionableTasksService } from './actionable-tasks/actionable-tasks.service';
import { EventReportsService } from './event-reports/event-reports.service';
import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventReportsService: EventReportsService,
    private readonly actionableTasksService: ActionableTasksService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  @Render('index')
  async getRander() {
    const events = await this.eventReportsService.getAllEventsByPayginate(
      1,
      30,
    );
    const tasks = await this.actionableTasksService.getAllTasksByPayginate(
      1,
      10,
    );

    return { message: 'hello', events, tasks };
  }
}
