import { IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class UpdateLoanDto {
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;

  @IsOptional()
  @IsNumber()
  milestoneIndex?: number;

  @IsOptional()
  @IsDateString()
  disbursedAt?: string;

  @IsOptional()
  @IsDateString()
  repaidAt?: string;
}
