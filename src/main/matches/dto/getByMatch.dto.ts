import { IsString } from "class-validator";

export class GetByMatchDto{
    @IsString()
    id:string;
}