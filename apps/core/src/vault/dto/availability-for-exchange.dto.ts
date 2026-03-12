import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class AvailabilityForExchangeDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsString()
  @IsNotEmpty()
  admin: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
