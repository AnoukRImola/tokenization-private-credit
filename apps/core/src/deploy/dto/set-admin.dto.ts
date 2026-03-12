import { IsString, IsNotEmpty } from 'class-validator';

export class SetAdminDto {
  @IsString()
  @IsNotEmpty()
  tokenFactoryContractId: string;

  @IsString()
  @IsNotEmpty()
  newAdmin: string;

  @IsString()
  @IsNotEmpty()
  callerPublicKey: string;
}
