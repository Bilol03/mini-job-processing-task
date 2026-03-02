import { ApiProperty } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { RoleEnum, TaskPriority, TaskStatus } from "src/constants/enums";


export interface IUserProfileDto {
    id: string
    email: string,
    is_active: boolean
    roles: RoleEnum
}


export class PaginationDto {
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        required: false,
        default: 1,
        description: 'Page number',
    })
    @IsOptional()
    @IsInt({ message: 'Page number must be an integer' })
    @Min(1)
    page: number = 1;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty({
        required: false,
        default: 10,
        description: 'Page size',
    })
    @IsOptional()
    @IsInt({ message: 'Page size must be an integer' })
    @Min(1)
    @Max(100)
    pageSize: number = 10;

    @ApiProperty({ enum: TaskPriority, default: TaskPriority.NORMAL, required: false })
    @IsEnum(TaskPriority)
    @IsOptional()
    type?: TaskPriority;

    @ApiProperty({ enum: TaskStatus, required: false })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @ApiProperty({ required: false, example: '2024-01-01', description: 'Start Date' })
    @IsString()
    @IsOptional()
    scheduledDate: string;



}