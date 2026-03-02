import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';


@Module({
  imports: [TypeOrmModule.forFeature([Task]),
  BullModule.registerQueue({
    name: 'tasks',
  })],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule { }
