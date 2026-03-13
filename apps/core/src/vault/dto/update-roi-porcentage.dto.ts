import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateRoiPorcentageDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsNumber()
  @IsNotEmpty()
  newRoiPorcentage: number;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}