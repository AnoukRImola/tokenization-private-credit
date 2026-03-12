import { IsString, IsNotEmpty } from 'class-validator';

export class DeployParticipationTokenDto {
  @IsString()
  @IsNotEmpty()
  escrowContractId: string;

  @IsString()
  @IsNotEmpty()
  tokenContractId: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}