import { Module } from '@nestjs/common';
import { TokenFactoryController } from './token-factory.controller';
import { TokenFactoryService } from './token-factory.service';

@Module({
  controllers: [TokenFactoryController],
  providers: [TokenFactoryService],
})
export class TokenFactoryModule {}
