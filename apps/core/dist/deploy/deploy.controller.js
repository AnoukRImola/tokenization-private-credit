"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployController = void 0;
const common_1 = require("@nestjs/common");
const deploy_service_1 = require("./deploy.service");
const deploy_participation_token_dto_1 = require("./dto/deploy-participation-token.dto");
const deploy_token_factory_dto_1 = require("./dto/deploy-token-factory.dto");
const deploy_vault_dto_1 = require("./dto/deploy-vault.dto");
let DeployController = class DeployController {
    deployService;
    constructor(deployService) {
        this.deployService = deployService;
    }
    async deployParticipationToken(dto) {
        const unsignedXdr = await this.deployService.deployParticipationToken(dto);
        return { unsignedXdr };
    }
    async deployTokenFactory(dto) {
        const unsignedXdr = await this.deployService.deployTokenFactory(dto);
        return { unsignedXdr };
    }
    async deployVault(dto) {
        const unsignedXdr = await this.deployService.deployVault(dto);
        return { unsignedXdr };
    }
};
exports.DeployController = DeployController;
__decorate([
    (0, common_1.Post)('participation-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deploy_participation_token_dto_1.DeployParticipationTokenDto]),
    __metadata("design:returntype", Promise)
], DeployController.prototype, "deployParticipationToken", null);
__decorate([
    (0, common_1.Post)('token-factory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deploy_token_factory_dto_1.DeployTokenFactoryDto]),
    __metadata("design:returntype", Promise)
], DeployController.prototype, "deployTokenFactory", null);
__decorate([
    (0, common_1.Post)('vault'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deploy_vault_dto_1.DeployVaultDto]),
    __metadata("design:returntype", Promise)
], DeployController.prototype, "deployVault", null);
exports.DeployController = DeployController = __decorate([
    (0, common_1.Controller)('deploy'),
    __metadata("design:paramtypes", [deploy_service_1.DeployService])
], DeployController);
//# sourceMappingURL=deploy.controller.js.map