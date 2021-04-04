import { IsString } from "class-validator";

export class UserSignupDto {
    @IsString()
    phoneNumber:string;

    @IsString()
    code:string;
}