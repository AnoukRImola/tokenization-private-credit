import { IsEnum, IsNotEmpty } from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class UpdateCampaignStatusDto {
  @IsEnum(CampaignStatus)
  @IsNotEmpty()
  status: CampaignStatus;
}
