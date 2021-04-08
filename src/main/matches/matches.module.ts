import { Module } from '@nestjs/common';
import { NetworkModule } from '../network/network.module';
import { NetworkService } from '../network/strategies/network.service';
import { MatchesController } from './matches.controller';
import { LiveService } from './stratagies/live.service';
import { ScoreService } from './stratagies/score.service';

@Module({
	controllers: [MatchesController],
	providers: [LiveService, ScoreService],
	imports:[NetworkModule]
})
export class MatchesModule {}
