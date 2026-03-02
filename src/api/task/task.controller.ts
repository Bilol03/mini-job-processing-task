import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { PaginationDto } from 'src/dtos/index';
import type { IUserProfileDto } from 'src/dtos/index';
import { JwtAuthGuard } from 'src/guards/auth-guard';
import { RolesGuard } from 'src/guards/role-guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: IUserProfileDto) {
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @CurrentUser() user: IUserProfileDto) {
    return this.taskService.findAll(query, user);
  }

 @Post('/:id/cancel')
 cancelTask(@Param('id')id: string, @CurrentUser() user: IUserProfileDto) {
  return this.taskService.cancelTask(id, user)
 }
}
