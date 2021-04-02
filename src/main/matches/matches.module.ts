import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { LiveService } from './stratagies/live.service';

@Module({
	controllers: [MatchesController],
	providers: [LiveService],
})
export class MatchesModule {}
