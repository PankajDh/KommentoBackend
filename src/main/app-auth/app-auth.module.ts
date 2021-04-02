import { Module } from '@nestjs/common';
import { AppAuthController } from './app-auth.controller';
import { AppAuthService } from './strategies/app-auth.service';

@Module({
	controllers: [AppAuthController],
	providers: [AppAuthService],
	exports: [AppAuthService],
})
export class AppAuthModule {}
