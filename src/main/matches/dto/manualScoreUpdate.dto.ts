import { IsNumber } from "class-validator";

export class ManualScoreUpdateDto{
    @IsNumber()
    teamOneRuns:number;

    @IsNumber()
    teamOneOvers:number;

    @IsNumber()
    teamOneWickets:number;

    @IsNumber()
    teamTwoRuns:number;

    @IsNumber()
    teamTwoOvers:number;

    @IsNumber()
    teamTwoWickets:number;
}