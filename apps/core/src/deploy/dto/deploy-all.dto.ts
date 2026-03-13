import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class DeployAllDto {
  @IsString()
  @IsNotEmpty()
  tokenName: string;

  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @IsString()
  @IsNotEmpty()
  escrowContract: string;

  @IsNumber()
  @IsNotEmpty()
  roiPercentage: number;

  @IsNumber()
  @IsNotEmpty()
  hardCap: number;

  @IsNumber()
  @IsNotEmpty()
  maxPerInvestor: number;

  @IsBoolean()
  vaultEnabled: boolean;

  @IsString()
  usdc: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
