import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { TaskPriority, TaskStatus } from "src/constants/enums";

export class UpdateTaskDto {
  @ApiProperty({ enum: TaskPriority, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: { to: "user@example.com" }, required: false })
  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @ApiProperty({ example: "2026-03-01T10:00:00.000Z", required: false })
  @IsDateString()
  @IsOptional()
  scheduled_at?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  last_error?: string;
}