import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { ActionableTasksService } from './actionable-tasks.service';
import { IResponse } from 'src/common/dto';
import { IGetAllTasks } from './dto/get-all-tasks.dto';
import { ProcessFlagEnum } from 'src/common/constants';

@Controller('actionable-tasks')
export class ActionableTasksController {
  constructor(
    private readonly actionableTasksService: ActionableTasksService,
  ) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    take: number = 1,
  ): Promise<IResponse<IGetAllTasks>> {
    const result = await this.actionableTasksService.getAllTasksByPayginate(
      page,
      take,
    );
    return {
      result: true,
      payload: result,
    };
  }

  @Post(':id/process-flag')
  async updatePrecessFlag(
    @Param('id') id: number,
    @Query('processFlag') processFlag: ProcessFlagEnum,
    @Res() res,
  ) {
    await this.actionableTasksService.updateProcessFlag(id, processFlag);
    return res.redirect(HttpStatus.FOUND, '/');
  }

  @Get(':id/details')
  @Render('task-details')
  async getAllDetails(@Param('id') id: number) {
    const result = await this.actionableTasksService.getAllDetails(id);
    return {
      result: true,
      payload: result,
    };
  }
}
