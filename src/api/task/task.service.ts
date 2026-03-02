import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum, TaskPriority, TaskStatus } from 'src/constants/enums';
import { IUserProfileDto, PaginationDto } from 'src/dtos';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async create(dto: CreateTaskDto, user: IUserProfileDto) {
    // 1. Idempotency key tekshirish
    const exists = await this.taskRepository.findOne({
      where: { idempotency_key: dto.idempotency_key },
    });

    if (exists) {
      throw new ConflictException(
        `Task with idempotency_key "${dto.idempotency_key}" already exists`,
      );
    }

    // 2. Task yaratish
    const task = this.taskRepository.create({
      ...dto,
      user_id: user.id,
      status: TaskStatus.PENDING,
      priority: dto.priority ?? TaskPriority.NORMAL,
      attempts: 0,
    });

    return this.taskRepository.save(task);
  }

  async findAll(query: PaginationDto, user: IUserProfileDto) {
    const { page, pageSize, type, status, scheduledDate } = query;

    const userRole = user['role']
    const userId = user.id
    const qb = this.taskRepository
      .createQueryBuilder("task")
      .orderBy("task.created_at", "DESC")
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (userRole !== RoleEnum.ADMIN) {
      qb.where("task.user_id = :userId", { userId });
    }
    if (type) {
      qb.andWhere("task.type = :type", { type });
    }

    if (status) {
      qb.andWhere("task.status = :status", { status });
    }
    if (scheduledDate) {
      const start = new Date(scheduledDate);
      const end = new Date(scheduledDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere("task.scheduled_at BETWEEN :start AND :end", {
        start: start,
        end: end,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }


  // tasks.service.ts
  async cancelTask(taskId: string, user: IUserProfileDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    const userRole = user['role']
    const userId = user.id

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    if (userRole !== RoleEnum.ADMIN && task.user_id !== userId) {
      throw new ForbiddenException("You can only cancel your own tasks");
    }

    if (task.status !== TaskStatus.PENDING) {
      throw new BadRequestException(
        `Only PENDING tasks can be cancelled. Current status: ${task.status}`,
      );
    }

    task.status = TaskStatus.CANCELLED;
    return this.taskRepository.save(task);
  }
}
