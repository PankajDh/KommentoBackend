import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/strategies/users.service';
import * as twilio from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { SendVerificationSmsDto } from '../dto/send-verification-sms.dto';
import { VerifySmsDto } from '../dto/verify-sms.dto';
const accountSid = 'AC85724283550ad2fc89d664c0a48b400d';
// const authToken = 'b4313848778f4ce1d4b1c3031a56870b';
const authToken = 'aa1167b977ea87728d55285c5d696942';
const serviceSid = 'VAe2ca4e0878d585310c6e86569527bdb8';

@Injectable()
export class SmsVerificationService {
	constructor(readonly usersService: UsersService) {}

	async sendVerificationSms(
		params: SendVerificationSmsDto,
	): Promise<VerificationInstance> {
		const { phoneNumber, countryCode } = params;
		const client = twilio(accountSid, authToken);
		let response;
		try {
			 response = await client.verify
				.services(serviceSid)
				.verifications.create({
					to: `${countryCode}${phoneNumber}`,
					channel: 'sms',
				});

		} catch(err){
			console.log(err);
		}

		return response;
	}

	async verifySms(
		params: VerifySmsDto,
	): Promise<{
		verified: boolean;
		userId?: string;
		isCommentator?: boolean;
	}> {
		const { phoneNumber, code, countryCode } = params;
		const client = twilio(accountSid, authToken);

		const response = await client.verify
			.services(serviceSid)
			.verificationChecks.create({
				to: `${countryCode}${phoneNumber}`,
				code,
			});

		if (response.status === 'approved') {
			const userDetails = await this.usersService.addLoginDetails(
				phoneNumber,
			);
			return {
				verified: true,
				userId: userDetails.id,
				isCommentator: userDetails.isCommentator,
			};
		}
		return {
			verified: false,
		};
	}
}
