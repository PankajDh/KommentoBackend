import { IsString } from 'class-validator';

export class GetTokenDto {
	@IsString()
	channelName: string;

	@IsString()
	userId: string;
}
