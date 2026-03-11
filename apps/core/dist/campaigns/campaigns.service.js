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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const ALLOWED_TRANSITIONS = {
    [client_1.CampaignStatus.DRAFT]: [client_1.CampaignStatus.FUNDRAISING, client_1.CampaignStatus.PAUSED],
    [client_1.CampaignStatus.FUNDRAISING]: [client_1.CampaignStatus.ACTIVE, client_1.CampaignStatus.PAUSED],
    [client_1.CampaignStatus.ACTIVE]: [client_1.CampaignStatus.REPAYMENT, client_1.CampaignStatus.PAUSED],
    [client_1.CampaignStatus.REPAYMENT]: [
        client_1.CampaignStatus.CLAIMABLE,
        client_1.CampaignStatus.PAUSED,
    ],
    [client_1.CampaignStatus.CLAIMABLE]: [client_1.CampaignStatus.CLOSED, client_1.CampaignStatus.PAUSED],
    [client_1.CampaignStatus.CLOSED]: [],
    [client_1.CampaignStatus.PAUSED]: [],
};
let CampaignsService = class CampaignsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: { investments: true },
        });
        if (!campaign)
            throw new common_1.NotFoundException(`Campaign ${id} not found`);
        return campaign;
    }
    create(dto) {
        return this.prisma.campaign.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.campaign.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.campaign.delete({ where: { id } });
    }
    async updateStatus(id, dto) {
        const campaign = await this.findOne(id);
        const currentStatus = campaign.status;
        const newStatus = dto.status;
        this.validateStatusTransition(currentStatus, newStatus, campaign.previousStatus);
        this.validatePrerequisites(campaign, newStatus);
        const data = {
            status: newStatus,
        };
        if (newStatus === client_1.CampaignStatus.PAUSED) {
            data.previousStatus = currentStatus;
        }
        else if (currentStatus === client_1.CampaignStatus.PAUSED) {
            data.previousStatus = null;
        }
        return this.prisma.campaign.update({
            where: { id },
            data,
        });
    }
    validateStatusTransition(current, next, previousStatus) {
        if (current === next) {
            throw new common_1.BadRequestException(`Campaign is already in status ${current}`);
        }
        if (current === client_1.CampaignStatus.PAUSED) {
            if (!previousStatus) {
                throw new common_1.BadRequestException('Cannot resume: no previous status recorded');
            }
            if (next !== previousStatus) {
                throw new common_1.BadRequestException(`Can only resume to previous status ${previousStatus}, not ${next}`);
            }
            return;
        }
        const allowed = ALLOWED_TRANSITIONS[current];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${current} to ${next}`);
        }
    }
    validatePrerequisites(campaign, newStatus) {
        if (newStatus === client_1.CampaignStatus.FUNDRAISING) {
            const missing = [];
            if (!campaign.escrowId)
                missing.push('escrowId');
            if (!campaign.tokenSaleId)
                missing.push('tokenSaleId');
            if (!campaign.tokenFactoryId)
                missing.push('tokenFactoryId');
            if (missing.length > 0) {
                throw new common_1.BadRequestException(`Cannot transition to FUNDRAISING: missing ${missing.join(', ')}`);
            }
        }
        if (newStatus === client_1.CampaignStatus.CLAIMABLE) {
            if (!campaign.vaultId) {
                throw new common_1.BadRequestException('Cannot transition to CLAIMABLE: missing vaultId');
            }
        }
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map