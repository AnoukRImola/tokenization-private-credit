import { IsString, IsNotEmpty } from 'class-validator';

export class AddTrustlineDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}
