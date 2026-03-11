import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BuyDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  usdcAddress: string;

  @IsString()
  @IsNotEmpty()
  payer: string;

  @IsString()
  @IsNotEmpty()
  beneficiary: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
