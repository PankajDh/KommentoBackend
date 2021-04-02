import { IsString } from 'class-validator';

export class UserJoinedDto {
	@IsString()
	userId: string;

	@IsString()
	matchId: string;

	@IsString()
	currentState: string;
}
