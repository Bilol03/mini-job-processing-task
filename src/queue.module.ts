
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || "localhost",
                port: parseInt(process.env.REDIS_PORT || "6379"),
            },
        }),
        BullModule.registerQueue({
            name: "tasks",
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000, // 1s, 2s, 4s
                },
                removeOnComplete: false,
                removeOnFail: false,
            },
        }),
    ],
    exports: [BullModule],
})
export class QueueModule { }