/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { AppAuthModule } from './main/app-auth/app-auth.module';
import { CommentriesModule } from './main/commentries/commentries.module';
import { MatchesModule } from './main/matches/matches.module';
import { RootController } from './main/root/root.controller';
import { UsersModule } from './main/users/users.module';
import { VerificationModule } from './main/verification/verification.module';

@Module({
	imports: [
		AppAuthModule,
		VerificationModule,
		MatchesModule,
		UsersModule,
		CommentriesModule,
	],
	controllers: [RootController],
})
export class MainModule implements NestModule {
	constructor() {}
	configure(consumer: MiddlewareConsumer): void {}
}
