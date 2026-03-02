


// task.processor.ts
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bullmq";
import { TaskStatus } from "src/constants/enums";
import { MockService } from "src/mock/mock.service";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";



@Processor("tasks", { concurrency: 5 })
export class TaskProcessor extends WorkerHost {
    private readonly logger = new Logger(TaskProcessor.name);
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly mockService: MockService,
    ) {
        super()
    }

    // task.processor.ts
    async process(job: Job<{ taskId: string }>): Promise<void> {
        const { taskId } = job.data;

        const task = await this.taskRepository.findOne({ where: { id: taskId } });
        if (!task) {
            this.logger.warn(`Task ${taskId} not found, skipping`);
            return;
        }
        console.log(task)
        // PROCESSING
        task.status = TaskStatus.PROCESSING;
        task.started_at = new Date();
        task.attempts = job.attemptsMade + 1;
        await this.taskRepository.save(task);

        // MockService chaqirish — throw qilsa BullMQ retry qiladi
        await this.mockService.processTask(task.payload ?? {});

        // COMPLETED
        task.status = TaskStatus.COMPLETED;
        task.completed_at = new Date();
        await this.taskRepository.save(task);

        this.logger.log(`Task ${taskId} completed`);
    }
}