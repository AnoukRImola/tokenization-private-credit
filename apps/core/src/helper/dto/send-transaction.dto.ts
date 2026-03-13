import { IsString, IsNotEmpty } from 'class-validator';

export class SendTransactionDto {
  @IsString()
  @IsNotEmpty()
  signedXdr: string;
}
