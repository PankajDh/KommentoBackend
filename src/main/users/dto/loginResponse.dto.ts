import { IsBoolean, IsOptional, IsString } from "class-validator";

export class LoginResponseDto {
    @IsString()
    @IsOptional()
    userId?:string;

    @IsBoolean()
    @IsOptional()
    verified?: boolean;

    @IsBoolean()
    @IsOptional()
    isCommentator?:boolean;

    @IsBoolean()
    newUser:boolean;
}