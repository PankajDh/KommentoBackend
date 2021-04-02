import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SmsVerificationService } from './strategies/sms-verification.service';
import { VerificationController } from './verification.controller';

@Module({
	controllers: [VerificationController],
	providers: [SmsVerificationService],
	imports: [UsersModule],
})
export class VerificationModule {}
