import { IsString } from 'class-validator';

export class UserJoinedDto {
	@IsString()
	userId: string;

	@IsString()
	commentaryId: string;

	@IsString()
	currentState: string;
}
