import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockModule } from 'src/mock/mock.module';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskProcessor } from './task.processor';
console.log("TaskProcessor import:", TaskProcessor);

@Module({
  imports: [TypeOrmModule.forFeature([Task]),
  BullModule.registerQueue({ name: "tasks" }),
  MockModule
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskProcessor],
})
export class TaskModule { }
