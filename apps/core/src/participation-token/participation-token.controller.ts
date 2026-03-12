import { Controller, Post, Body } from '@nestjs/common';
import { ParticipationTokenService } from './participation-token.service';
import { BuyDto } from './dto/buy.dto';

@Controller('participation-token')
export class ParticipationTokenController {
  constructor(
    private readonly participationTokenService: ParticipationTokenService,
  ) {}

  @Post('buy')
  async buy(@Body() dto: BuyDto) {
    const unsignedXdr = await this.participationTokenService.buy(dto);
    return { unsignedXdr };
  }
}
