import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class UpdateUserDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ example: "strongPassword123", minLength: 6 })
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;


    @ApiProperty({ example: true, required: false, default: true })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
