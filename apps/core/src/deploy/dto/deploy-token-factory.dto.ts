import { IsString, IsNotEmpty } from 'class-validator';

export class DeployTokenFactoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  escrowContractId: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
