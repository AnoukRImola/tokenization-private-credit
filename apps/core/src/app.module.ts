import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [PrismaModule, CampaignsModule, InvestmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
