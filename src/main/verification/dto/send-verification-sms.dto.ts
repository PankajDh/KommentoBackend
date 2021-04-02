import { IsString } from 'class-validator';

export class SendVerificationSmsDto {
	@IsString()
	phoneNumber: string;

	@IsString()
	countryCode: string;
}
