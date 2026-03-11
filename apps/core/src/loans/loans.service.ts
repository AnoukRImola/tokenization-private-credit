import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LoanStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

const ALLOWED_TRANSITIONS: Record<LoanStatus, LoanStatus[]> = {
  [LoanStatus.PENDING]: [LoanStatus.DISBURSED],
  [LoanStatus.DISBURSED]: [LoanStatus.REPAID, LoanStatus.DEFAULTED],
  [LoanStatus.REPAID]: [],
  [LoanStatus.DEFAULTED]: [],
};

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { campaign: true },
    });
  }

  async findOne(id: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!loan) throw new NotFoundException(`Loan ${id} not found`);

    return loan;
  }

  findByCampaign(campaignId: string) {
    return this.prisma.loan.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(dto: CreateLoanDto) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: dto.campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign ${dto.campaignId} not found`);
    }

    if (dto.amount > Number(campaign.loanSize)) {
      throw new BadRequestException(
        `Loan amount ${dto.amount} exceeds campaign loan size ${campaign.loanSize}`,
      );
    }

    const stats = await this.prisma.loan.aggregate({
      where: { campaignId: dto.campaignId },
      _sum: { amount: true },
    });

    const currentTotal = Number(stats._sum.amount ?? 0);
    if (currentTotal + dto.amount > Number(campaign.poolSize)) {
      throw new BadRequestException(
        `Total loans (${currentTotal + dto.amount}) would exceed pool size ${campaign.poolSize}`,
      );
    }

    return this.prisma.loan.create({
      data: dto,
      include: { campaign: true },
    });
  }

  async update(id: string, dto: UpdateLoanDto) {
    const loan = await this.findOne(id);

    if (dto.status) {
      this.validateStatusTransition(loan.status, dto.status);
    }

    return this.prisma.loan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const loan = await this.findOne(id);

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException(
        `Cannot delete loan in status ${loan.status}. Only PENDING loans can be deleted.`,
      );
    }

    return this.prisma.loan.delete({ where: { id } });
  }

  getCampaignLoanStats(campaignId: string) {
    return this.prisma.loan.aggregate({
      where: { campaignId },
      _sum: { amount: true },
      _count: true,
    });
  }

  private validateStatusTransition(current: LoanStatus, next: LoanStatus) {
    if (current === next) {
      throw new BadRequestException(`Loan is already in status ${current}`);
    }

    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${next}`,
      );
    }
  }
}
