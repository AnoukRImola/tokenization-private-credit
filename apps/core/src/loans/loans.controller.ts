import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Get('campaign/:campaignId/stats')
  getCampaignLoanStats(@Param('campaignId') campaignId: string) {
    return this.loansService.getCampaignLoanStats(campaignId);
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string) {
    return this.loansService.findByCampaign(campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoanDto) {
    return this.loansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(id);
  }
}
