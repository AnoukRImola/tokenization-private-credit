-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FUNDED', 'PAUSED', 'CLOSED');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "issuerAddress" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "poolSize" DECIMAL(65,30) NOT NULL,
    "loanDuration" INTEGER NOT NULL,
    "expectedReturn" DECIMAL(65,30) NOT NULL,
    "loanSize" DECIMAL(65,30) NOT NULL,
    "vaultId" TEXT,
    "tokenSaleId" TEXT,
    "tokenFactoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "investorAddress" TEXT NOT NULL,
    "usdcAmount" DECIMAL(65,30) NOT NULL,
    "tokenAmount" DECIMAL(65,30) NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investments_txHash_key" ON "investments"("txHash");

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
