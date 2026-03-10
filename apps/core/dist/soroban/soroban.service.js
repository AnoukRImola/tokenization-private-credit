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
exports.SorobanService = void 0;
const common_1 = require("@nestjs/common");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
let SorobanService = class SorobanService {
    rpcUrl;
    networkPassphrase;
    constructor() {
        this.rpcUrl = process.env.SOROBAN_RPC_URL;
        this.networkPassphrase = stellar_sdk_1.Networks.TESTNET;
    }
    async buildDeployTransaction(wasmHash, args, callerPublicKey) {
        const tx = await stellar_sdk_1.contract.Client.deploy(args, {
            wasmHash,
            format: 'hex',
            rpcUrl: this.rpcUrl,
            networkPassphrase: this.networkPassphrase,
            publicKey: callerPublicKey,
        });
        return tx.toXDR();
    }
    async buildContractCallTransaction(contractId, method, args, callerPublicKey) {
        const client = await stellar_sdk_1.contract.Client.from({
            contractId,
            rpcUrl: this.rpcUrl,
            networkPassphrase: this.networkPassphrase,
            publicKey: callerPublicKey,
        });
        const tx = await client[method](args);
        return tx.toXDR();
    }
};
exports.SorobanService = SorobanService;
exports.SorobanService = SorobanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SorobanService);
//# sourceMappingURL=soroban.service.js.map