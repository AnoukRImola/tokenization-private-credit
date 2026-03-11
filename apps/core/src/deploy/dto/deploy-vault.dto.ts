import { IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class DeployVaultDto {
  @IsString()
  @IsNotEmpty()
  admin: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @IsNumber()
  @IsNotEmpty()
  roiPercentage: number;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  usdc: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
