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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployService = void 0;
const common_1 = require("@nestjs/common");
const soroban_service_1 = require("../soroban/soroban.service");
const TOKEN_DECIMAL = 7;
let DeployService = class DeployService {
    soroban;
    participationTokenWasmHash;
    tokenFactoryWasmHash;
    vaultWasmHash;
    constructor(soroban) {
        this.soroban = soroban;
        this.participationTokenWasmHash =
            process.env.PARTICIPATION_TOKEN_WASM_HASH;
        this.tokenFactoryWasmHash = process.env.TOKEN_FACTORY_WASM_HASH;
        this.vaultWasmHash = process.env.VAULT_WASM_HASH;
    }
    deployParticipationToken(dto) {
        return this.soroban.buildDeployTransaction(this.participationTokenWasmHash, {
            escrow_contract: dto.escrowContractId,
            participation_token: dto.tokenContractId,
        }, dto.callerPublicKey);
    }
    deployTokenFactory(dto) {
        return this.soroban.buildDeployTransaction(this.tokenFactoryWasmHash, {
            name: dto.name,
            symbol: dto.symbol,
            escrow_id: dto.escrowContractId,
            decimal: TOKEN_DECIMAL,
            mint_authority: dto.mintAuthority,
        }, dto.callerPublicKey);
    }
    deployVault(dto) {
        return this.soroban.buildDeployTransaction(this.vaultWasmHash, {
            admin: dto.admin,
            enabled: dto.enabled,
            roi_percentage: dto.roiPercentage,
            token: dto.token,
            usdc: dto.usdc,
        }, dto.callerPublicKey);
    }
};
exports.DeployService = DeployService;
exports.DeployService = DeployService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [soroban_service_1.SorobanService])
], DeployService);
//# sourceMappingURL=deploy.service.js.map