import { Controller, Post, Body } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post('participation-token')
  async deployParticipationToken(@Body() dto: DeployParticipationTokenDto) {
    const unsignedXdr = await this.deployService.deployParticipationToken(dto);
    return { unsignedXdr };
  }
}