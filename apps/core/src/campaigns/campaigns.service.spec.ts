import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CampaignStatus } from '@prisma/client';
import { CampaignsService } from './campaigns.service';
import { PrismaService } from '../prisma/prisma.service';

function makeCampaign(overrides: Partial<any> = {}) {
  return {
    id: 'campaign-1',
    name: 'Test Campaign',
    description: null,
    status: CampaignStatus.DRAFT,
    previousStatus: null,
    issuerAddress: '0xISSUER',
    escrowId: 'escrow-1',
    poolSize: 1000,
    loanDuration: 30,
    expectedReturn: 10,
    loanSize: 500,
    vaultId: null,
    tokenSaleId: null,
    tokenFactoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    investments: [],
    ...overrides,
  };
}

describe('CampaignsService', () => {
  let service: CampaignsService;
  let prisma: {
    campaign: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      campaign: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  describe('updateStatus', () => {
    describe('happy path transitions', () => {
      it('DRAFT → FUNDRAISING', async () => {
        const campaign = makeCampaign({
          tokenSaleId: 'ts-1',
          tokenFactoryId: 'tf-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.FUNDRAISING,
        });

        const result = await service.updateStatus('campaign-1', {
          status: CampaignStatus.FUNDRAISING,
        });

        expect(result.status).toBe(CampaignStatus.FUNDRAISING);
        expect(prisma.campaign.update).toHaveBeenCalledWith({
          where: { id: 'campaign-1' },
          data: { status: CampaignStatus.FUNDRAISING },
        });
      });

      it('FUNDRAISING → ACTIVE', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.FUNDRAISING,
          tokenSaleId: 'ts-1',
          tokenFactoryId: 'tf-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.ACTIVE,
        });

        const result = await service.updateStatus('campaign-1', {
          status: CampaignStatus.ACTIVE,
        });

        expect(result.status).toBe(CampaignStatus.ACTIVE);
      });

      it('ACTIVE → REPAYMENT', async () => {
        const campaign = makeCampaign({ status: CampaignStatus.ACTIVE });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.REPAYMENT,
        });

        const result = await service.updateStatus('campaign-1', {
          status: CampaignStatus.REPAYMENT,
        });

        expect(result.status).toBe(CampaignStatus.REPAYMENT);
      });

      it('REPAYMENT → CLAIMABLE', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.REPAYMENT,
          vaultId: 'vault-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.CLAIMABLE,
        });

        const result = await service.updateStatus('campaign-1', {
          status: CampaignStatus.CLAIMABLE,
        });

        expect(result.status).toBe(CampaignStatus.CLAIMABLE);
      });

      it('CLAIMABLE → CLOSED', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.CLAIMABLE,
          vaultId: 'vault-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.CLOSED,
        });

        const result = await service.updateStatus('campaign-1', {
          status: CampaignStatus.CLOSED,
        });

        expect(result.status).toBe(CampaignStatus.CLOSED);
      });
    });

    describe('pause and resume', () => {
      it('pauses from ACTIVE and saves previousStatus', async () => {
        const campaign = makeCampaign({ status: CampaignStatus.ACTIVE });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.PAUSED,
          previousStatus: CampaignStatus.ACTIVE,
        });

        await service.updateStatus('campaign-1', {
          status: CampaignStatus.PAUSED,
        });

        expect(prisma.campaign.update).toHaveBeenCalledWith({
          where: { id: 'campaign-1' },
          data: {
            status: CampaignStatus.PAUSED,
            previousStatus: CampaignStatus.ACTIVE,
          },
        });
      });

      it('pauses from FUNDRAISING and saves previousStatus', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.FUNDRAISING,
          tokenSaleId: 'ts-1',
          tokenFactoryId: 'tf-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.PAUSED,
          previousStatus: CampaignStatus.FUNDRAISING,
        });

        await service.updateStatus('campaign-1', {
          status: CampaignStatus.PAUSED,
        });

        expect(prisma.campaign.update).toHaveBeenCalledWith({
          where: { id: 'campaign-1' },
          data: {
            status: CampaignStatus.PAUSED,
            previousStatus: CampaignStatus.FUNDRAISING,
          },
        });
      });

      it('resumes from PAUSED to previousStatus and clears it', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.PAUSED,
          previousStatus: CampaignStatus.ACTIVE,
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);
        prisma.campaign.update.mockResolvedValue({
          ...campaign,
          status: CampaignStatus.ACTIVE,
          previousStatus: null,
        });

        await service.updateStatus('campaign-1', {
          status: CampaignStatus.ACTIVE,
        });

        expect(prisma.campaign.update).toHaveBeenCalledWith({
          where: { id: 'campaign-1' },
          data: {
            status: CampaignStatus.ACTIVE,
            previousStatus: null,
          },
        });
      });

      it('rejects resume to a different status than previousStatus', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.PAUSED,
          previousStatus: CampaignStatus.ACTIVE,
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.FUNDRAISING,
          }),
        ).rejects.toThrow(BadRequestException);
      });

      it('rejects resume when no previousStatus is recorded', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.PAUSED,
          previousStatus: null,
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.ACTIVE,
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('invalid transitions', () => {
      it('rejects DRAFT → ACTIVE (skipping FUNDRAISING)', async () => {
        const campaign = makeCampaign();
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.ACTIVE,
          }),
        ).rejects.toThrow(BadRequestException);
      });

      it('rejects CLOSED → any status', async () => {
        const campaign = makeCampaign({ status: CampaignStatus.CLOSED });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.ACTIVE,
          }),
        ).rejects.toThrow(BadRequestException);
      });

      it('rejects transitioning to the same status', async () => {
        const campaign = makeCampaign({ status: CampaignStatus.ACTIVE });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.ACTIVE,
          }),
        ).rejects.toThrow(BadRequestException);
      });

      it('rejects FUNDRAISING → CLOSED (skipping steps)', async () => {
        const campaign = makeCampaign({
          status: CampaignStatus.FUNDRAISING,
          tokenSaleId: 'ts-1',
          tokenFactoryId: 'tf-1',
        });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.CLOSED,
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('prerequisite validation', () => {
      it('rejects DRAFT → FUNDRAISING without tokenSaleId', async () => {
        const campaign = makeCampaign({ tokenFactoryId: 'tf-1' });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.FUNDRAISING,
          }),
        ).rejects.toThrow(/tokenSaleId/);
      });

      it('rejects DRAFT → FUNDRAISING without tokenFactoryId', async () => {
        const campaign = makeCampaign({ tokenSaleId: 'ts-1' });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.FUNDRAISING,
          }),
        ).rejects.toThrow(/tokenFactoryId/);
      });

      it('rejects REPAYMENT → CLAIMABLE without vaultId', async () => {
        const campaign = makeCampaign({ status: CampaignStatus.REPAYMENT });
        prisma.campaign.findUnique.mockResolvedValue(campaign);

        await expect(
          service.updateStatus('campaign-1', {
            status: CampaignStatus.CLAIMABLE,
          }),
        ).rejects.toThrow(/vaultId/);
      });
    });

    it('throws NotFoundException for non-existent campaign', async () => {
      prisma.campaign.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('non-existent', {
          status: CampaignStatus.FUNDRAISING,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
