import { Body, Controller, Patch } from '@nestjs/common';
import { ApplyForCommentaryDto } from './dto/applyForCommentary.dto';
import { UserJoinedDto } from './dto/userJoined.dto';
import { UsersService } from './strategies/users.service';

@Controller('users')
export class UsersController {
	constructor(readonly usersService: UsersService) {}

	@Patch('/start/kyc')
	async startKyc(@Body() params: ApplyForCommentaryDto): Promise<void> {
		return this.usersService.startKyc(params);
	}

	@Patch('/join/match')
	async userJoinedMatch(@Body() params: UserJoinedDto): Promise<void> {
		return this.usersService.userJoinedMatch(params);
	}
}
