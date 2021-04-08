import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './strategies/network.service';

@Module({
  controllers: [NetworkController],
  providers:[NetworkService],
  exports:[NetworkService]
})
export class NetworkModule {}
