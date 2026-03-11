import { Controller, Post, Body } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeployParticipationTokenDto } from './dto/deploy-participation-token.dto';
import { DeployTokenFactoryDto } from './dto/deploy-token-factory.dto';
import { DeployVaultDto } from './dto/deploy-vault.dto';
import { SetAdminDto } from './dto/set-admin.dto';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Post('participation-token')
  async deployParticipationToken(@Body() dto: DeployParticipationTokenDto) {
    const unsignedXdr = await this.deployService.deployParticipationToken(dto);
    return { unsignedXdr };
  }

  @Post('token-factory')
  async deployTokenFactory(@Body() dto: DeployTokenFactoryDto) {
    const unsignedXdr = await this.deployService.deployTokenFactory(dto);
    return { unsignedXdr };
  }

  @Post('vault')
  async deployVault(@Body() dto: DeployVaultDto) {
    const unsignedXdr = await this.deployService.deployVault(dto);
    return { unsignedXdr };
  }

  @Post('set-admin')
  async setAdmin(@Body() dto: SetAdminDto) {
    const unsignedXdr = await this.deployService.buildSetAdminTransaction(dto);
    return { unsignedXdr };
  }
}