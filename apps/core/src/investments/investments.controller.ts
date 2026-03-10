import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  findAll() {
    return this.investmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.investmentsService.findByCampaign(campaignId);
  }

  @Post()
  create(@Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(dto);
  }
}