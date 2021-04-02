import { Controller, Get, Query } from '@nestjs/common';
import { GetCommentriesByMatchDto } from './dto/getCommentriesByMatch.dto';
import { CommentriesService } from './strategies/commentries.service';

@Controller('commentries')
export class CommentriesController {
	constructor(readonly commentriesService: CommentriesService) {}

	@Get('match')
	async getByMatch(@Query() params: GetCommentriesByMatchDto) {
		return this.commentriesService.getCommentriesByMatch(params);
	}
}
