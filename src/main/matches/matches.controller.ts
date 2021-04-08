import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AutomaticScoreUpdateDto } from './dto/automaticScoreUpdate.dto';
import { GetByMatchDto } from './dto/getByMatch.dto';
import { ManualScoreUpdateDto } from './dto/manualScoreUpdate.dto';
import { LiveService } from './stratagies/live.service';
import { ScoreService } from './stratagies/score.service';

@Controller('matches')
export class MatchesController {
	constructor(readonly liveService: LiveService, readonly scoreService: ScoreService) {}

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

	@Patch('/automatic/:id')
	async saveScore(@Param() params: GetByMatchDto, @Body() body:AutomaticScoreUpdateDto): Promise<any> {
		return this.scoreService.saveScore(body.matchId, body.seriesId, params.id);
	}

	@Patch('/manual/:id')
	async saveScoreManually(@Param() params: GetByMatchDto, @Body() body:ManualScoreUpdateDto): Promise<any> {
		return this.scoreService.saveScoreManually(body, params.id);
	}
}


