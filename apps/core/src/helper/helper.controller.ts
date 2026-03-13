import { Controller, Post, Body } from '@nestjs/common';
import { HelperService } from './helper.service';
import { SendTransactionDto } from './dto/send-transaction.dto';
import { rpc } from '@stellar/stellar-sdk';

@Controller('helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Post('send-transaction')
  async sendTransaction(@Body() dto: SendTransactionDto) {
    try {
      return await this.helperService.submitTransaction(dto.signedXdr);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        status: rpc.Api.GetTransactionStatus.FAILED,
        message:
          message ||
          'An unknown error occurred while submitting the transaction.',
      };
    }
  }
}
