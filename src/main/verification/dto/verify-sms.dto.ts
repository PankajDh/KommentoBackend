import { IsString } from 'class-validator';

export class VerifySmsDto {
	@IsString()
	phoneNumber: string;

	@IsString()
	countryCode: string;

	@IsString()
	code: string;
}
