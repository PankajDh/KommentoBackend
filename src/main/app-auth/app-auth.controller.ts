import { Controller, Get, Query } from '@nestjs/common';
import { GetTokenDto } from './dto/getToken.dto';
import { AppAuthService } from './strategies/app-auth.service';

@Controller('app-auth')
export class AppAuthController {
	constructor(readonly appAuthService: AppAuthService) {}

	@Get('/token')
	async getToken(
		@Query() getTokenParams: GetTokenDto,
	): Promise<{ token: string }> {
		return this.appAuthService.getToken(getTokenParams);
	}
}
