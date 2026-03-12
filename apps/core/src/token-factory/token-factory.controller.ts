import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { TokenFactoryService } from './token-factory.service';
import { MintDto } from './dto/mint.dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { ApproveDto } from './dto/approve.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransferFromDto } from './dto/transfer-from.dto';
import { BurnDto } from './dto/burn.dto';
import { BurnFromDto } from './dto/burn-from.dto';

@Controller('token-factory')
export class TokenFactoryController {
  constructor(private readonly tokenFactoryService: TokenFactoryService) {}

  // ── POST endpoints (writes) ──

  @Post('mint')
  async mint(@Body() dto: MintDto) {
    const unsignedXdr = await this.tokenFactoryService.mint(dto);
    return { unsignedXdr };
  }

  @Post('set-admin')
  async setAdmin(@Body() dto: SetAdminDto) {
    const unsignedXdr = await this.tokenFactoryService.setAdmin(dto);
    return { unsignedXdr };
  }

  @Post('approve')
  async approve(@Body() dto: ApproveDto) {
    const unsignedXdr = await this.tokenFactoryService.approve(dto);
    return { unsignedXdr };
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferDto) {
    const unsignedXdr = await this.tokenFactoryService.transfer(dto);
    return { unsignedXdr };
  }

  @Post('transfer-from')
  async transferFrom(@Body() dto: TransferFromDto) {
    const unsignedXdr = await this.tokenFactoryService.transferFrom(dto);
    return { unsignedXdr };
  }

  @Post('burn')
  async burn(@Body() dto: BurnDto) {
    const unsignedXdr = await this.tokenFactoryService.burn(dto);
    return { unsignedXdr };
  }

  @Post('burn-from')
  async burnFrom(@Body() dto: BurnFromDto) {
    const unsignedXdr = await this.tokenFactoryService.burnFrom(dto);
    return { unsignedXdr };
  }

  // ── GET endpoints (reads) ──

  @Get('balance')
  async getBalance(
    @Query('contractId') contractId: string,
    @Query('address') address: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const balance = await this.tokenFactoryService.getBalance(contractId, address, callerPublicKey);
    return { balance: String(balance) };
  }

  @Get('allowance')
  async getAllowance(
    @Query('contractId') contractId: string,
    @Query('from') from: string,
    @Query('spender') spender: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const allowance = await this.tokenFactoryService.getAllowance(
      contractId,
      from,
      spender,
      callerPublicKey,
    );
    return { allowance: String(allowance) };
  }

  @Get('decimals')
  async getDecimals(
    @Query('contractId') contractId: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const decimals = await this.tokenFactoryService.getDecimals(contractId, callerPublicKey);
    return { decimals };
  }

  @Get('name')
  async getName(
    @Query('contractId') contractId: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const name = await this.tokenFactoryService.getName(contractId, callerPublicKey);
    return { name: String(name) };
  }

  @Get('symbol')
  async getSymbol(
    @Query('contractId') contractId: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const symbol = await this.tokenFactoryService.getSymbol(contractId, callerPublicKey);
    return { symbol: String(symbol) };
  }

  @Get('escrow-id')
  async getEscrowId(
    @Query('contractId') contractId: string,
    @Query('callerPublicKey') callerPublicKey: string,
  ) {
    const escrowId = await this.tokenFactoryService.getEscrowId(contractId, callerPublicKey);
    return { escrowId: String(escrowId) };
  }
}
