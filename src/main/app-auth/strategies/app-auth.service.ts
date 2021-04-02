import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { GetTokenDto } from '../dto/getToken.dto';

@Injectable()
export class AppAuthService {
	async getToken(params: GetTokenDto): Promise<{ token: string }> {
		const appID = '06b6c41aaad74e66ae944240858be524';
		const appCertificate = 'e9ec5c42babe480db444e16569233c6b';

		const { channelName, userId } = params;
		// const uid = 2882341273;
		// const account = '2882341273';
		const role = RtcRole.PUBLISHER;

		const expirationTimeInSeconds = 3600 * 6;

		const currentTimestamp = Math.floor(Date.now() / 1000);

		const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

		// IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

		// Build token with uid
		const token = RtcTokenBuilder.buildTokenWithUid(
			appID,
			appCertificate,
			channelName,
			parseInt(userId),
			role,
			privilegeExpiredTs,
		);
		// console.log('Token With Integer Number Uid: ' + tokenA);

		// Build token with user account
		// const token = RtcTokenBuilder.buildTokenWithAccount(
		// 	appID,
		// 	appCertificate,
		// 	channelName,
		// 	account,
		// 	role,
		// 	privilegeExpiredTs,
		// );
		// console.log('Token With UserAccount: ' + tokenB);
		return {
			token,
		};
	}
}
