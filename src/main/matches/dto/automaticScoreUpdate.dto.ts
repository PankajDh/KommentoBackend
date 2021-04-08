import {  IsString } from "class-validator";

export class AutomaticScoreUpdateDto{
   @IsString()
   matchId:string;

   @IsString()
   seriesId:string;
}