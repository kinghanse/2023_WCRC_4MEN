import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventReportsModule } from './event-reports/event-reports.module';
import { ActionableTasksModule } from './actionable-tasks/actionable-tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EventReportsModule,
    ActionableTasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
