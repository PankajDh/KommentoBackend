import { Module } from '@nestjs/common';
import { CommentriesController } from './commentries.controller';
import { CommentriesService } from './strategies/commentries.service';

@Module({
	controllers: [CommentriesController],
	providers: [CommentriesService],
	exports: [CommentriesService],
})
export class CommentriesModule {}
