import { Module } from '@nestjs/common';
import { TrustlineController } from './trustline.controller';
import { TrustlineService } from './trustline.service';

@Module({
  controllers: [TrustlineController],
  providers: [TrustlineService],
})
export class TrustlineModule {}
