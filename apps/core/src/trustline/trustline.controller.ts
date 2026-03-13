import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { TrustlineService } from './trustline.service';
import { AddTrustlineDto } from './dto/add-trustline.dto';

@Controller('trustline')
export class TrustlineController {
  constructor(private readonly trustlineService: TrustlineService) {}

  @Post('add')
  async add(@Body() dto: AddTrustlineDto) {
    try {
      const xdr =
        await this.trustlineService.buildAddTrustlineTransaction(dto.address);
      return {
        success: true,
        xdr,
        message: 'Trustline transaction built. Sign with wallet and submit.',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException({
        error: 'Failed to build trustline transaction',
        details: message,
      });
    }
  }
}
