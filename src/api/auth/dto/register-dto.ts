import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class RegisterDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "strongPassword123", minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;


    @ApiProperty({ example: true, required: false, default: true })
    @IsOptional()
    is_active?: boolean;
}
