import { IsBoolean, IsString } from 'class-validator';

export class ApplyForCommentaryDto {
	@IsString()
	email: string;

	@IsBoolean()
	canCall: boolean;

	@IsString()
	userId: string;
}
