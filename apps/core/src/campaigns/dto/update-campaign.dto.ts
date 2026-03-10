import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  Min,
} from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  poolSize?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  loanDuration?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  expectedReturn?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  loanSize?: number;

  @IsString()
  @IsOptional()
  vaultId?: string;

  @IsString()
  @IsOptional()
  tokenSaleId?: string;

  @IsString()
  @IsOptional()
  tokenFactoryId?: string;
}