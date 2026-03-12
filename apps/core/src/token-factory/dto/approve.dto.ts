import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class ApproveDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  spender: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  expirationLedger: number;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
