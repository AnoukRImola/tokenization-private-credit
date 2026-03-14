import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveForTrustlineDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  spender: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
