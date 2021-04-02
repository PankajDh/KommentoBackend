import { Controller, Get, Query } from '@nestjs/common';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { SendVerificationSmsDto } from './dto/send-verification-sms.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { SmsVerificationService } from './strategies/sms-verification.service';

@Controller('verification')
export class VerificationController {
	constructor(readonly smsVerificationService: SmsVerificationService) {}

	@Get('/send-sms')
	async sendSms(
		@Query() params: SendVerificationSmsDto,
	): Promise<VerificationInstance> {
		return this.smsVerificationService.sendVerificationSms(params);
	}

	@Get()
	async verifySms(
		@Query() params: VerifySmsDto,
	): Promise<{
		verified: boolean;
		userId?: string;
		isCommentator?: boolean;
	}> {
		return this.smsVerificationService.verifySms(params);
	}
}
