import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SorobanModule } from './soroban/soroban.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { InvestmentsModule } from './investments/investments.module';
import { DeployModule } from './deploy/deploy.module';

@Module({
  imports: [PrismaModule, SorobanModule, CampaignsModule, InvestmentsModule, DeployModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
