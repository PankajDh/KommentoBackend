import { Controller, Get } from '@nestjs/common';
import { LiveService } from './stratagies/live.service';

@Controller('matches')
export class MatchesController {
	constructor(readonly liveService: LiveService) {}

	@Get('/live')
	async getLiveMatch() {
		return this.liveService.getMatches('LIVE');
	}

	@Get('/highlights')
	async getHighLights() {
		return this.liveService.getMatches('HIGHLIGHTS');
	}
}
