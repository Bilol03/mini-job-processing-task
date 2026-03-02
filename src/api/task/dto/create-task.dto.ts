import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { TaskPriority, TaskStatus } from "src/constants/enums";

export class CreateTaskDto {
  @ApiProperty({ example: "email_send" })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.NORMAL, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: { to: "user@example.com", subject: "Hello" }, required: false })
  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @ApiProperty({ example: "unique-key-123" })
  @IsString()
  @IsNotEmpty()
  idempotency_key: string;

  @ApiProperty({ example: "2026-03-01T10:00:00.000Z", required: false })
  @IsDateString()
  @IsOptional()
  scheduled_at?: Date;
}