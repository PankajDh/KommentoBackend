import { Controller, Get, Param } from '@nestjs/common';
import { GetByMatchDto } from './dto/getByMatch.dto';
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
	
	@Get('/featured')
	async getFeaturedMatches() {
		return this.liveService.getFeaturedMatches();
	}

	@Get(':id')
	async getMatchById(@Param() params:GetByMatchDto) {
		return this.liveService.getMatchById(params.id);
	}
}
function Params() {
	throw new Error('Function not implemented.');
}

