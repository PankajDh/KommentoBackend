import { IsString } from 'class-validator';

export class GetCommentriesByMatchDto {
	@IsString()
	matchId: string;
}
