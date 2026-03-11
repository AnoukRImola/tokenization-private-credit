-- CreateEnum: CampaignStatus_new with updated values
CREATE TYPE "CampaignStatus_new" AS ENUM (
  'DRAFT', 'FUNDRAISING', 'ACTIVE', 'REPAYMENT', 'CLAIMABLE', 'CLOSED', 'PAUSED'
);

-- Map FUNDED → ACTIVE before swapping
UPDATE "campaigns" SET "status" = 'ACTIVE' WHERE "status" = 'FUNDED';

-- Swap enum: drop default → column to TEXT → drop old enum → rename new → column back to enum
ALTER TABLE "campaigns" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "campaigns" ALTER COLUMN "status" TYPE TEXT;
DROP TYPE "CampaignStatus";
ALTER TYPE "CampaignStatus_new" RENAME TO "CampaignStatus";
ALTER TABLE "campaigns" ALTER COLUMN "status" TYPE "CampaignStatus" USING "status"::"CampaignStatus";
ALTER TABLE "campaigns" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"CampaignStatus";

-- Add previousStatus column
ALTER TABLE "campaigns" ADD COLUMN "previousStatus" "CampaignStatus";
