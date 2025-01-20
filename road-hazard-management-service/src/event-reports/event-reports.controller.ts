import { EventReportsService } from './event-reports.service';
import { TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IEvent } from './dto';
import { IResponse } from 'src/common/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { IGetAllEvents } from './dto/get-all-events.dto';

@Controller('event-reports')
export class EventReportsController {
  constructor(private readonly eventReportsService: EventReportsService) {}

  @TypedRoute.Post()
  async create(@Body() event: IEvent): Promise<IResponse<IEvent>> {
    const result =
      await this.eventReportsService.createEventAndUpdateTask(event);
    return {
      result: true,
      payload: result,
    };
  }

  @Post('images')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', 'public'),
        filename: (_, file, callback) => {
          callback(null, file.originalname);
        },
      }),
      fileFilter: (_: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Unsupported file type ${path.extname(file.originalname)}`,
            ),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      result: true,
      payload: file.filename,
    };
  }

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('take') take: number = 1,
  ): Promise<IResponse<IGetAllEvents>> {
    const result = await this.eventReportsService.getAllEventsByPayginate(
      page,
      take,
    );
    return {
      result: true,
      payload: result,
    };
  }
}
