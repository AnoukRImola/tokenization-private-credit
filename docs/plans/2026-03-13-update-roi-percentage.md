# Update ROI Percentage — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow backoffice admins to update the ROI percentage of a campaign's vault from the `/roi` page via an actions dropdown menu.

**Architecture:** Add a dropdown-menu UI component, an API call function, a hook (following `useToggleVault` pattern), and a dialog (following `FundRoiDialog` pattern). Replace inline action buttons in the ROI table row with a dropdown menu that groups all actions.

**Tech Stack:** React 19, Next.js 16, Radix UI (dropdown-menu), TanStack React Query, Soroban wallet signing, sonner toasts.

---

### Task 1: Add DropdownMenu UI component

**Files:**
- Create: `packages/ui/src/dropdown-menu.tsx`

**Step 1: Install Radix dropdown-menu dependency**

Run from repo root:
```bash
cd packages/ui && npm install @radix-ui/react-dropdown-menu
```

**Step 2: Create the component**

Create `packages/ui/src/dropdown-menu.tsx` exporting Radix primitives styled consistently with the existing dialog/popover components. Follow the same pattern as `packages/ui/src/dialog.tsx` — thin wrappers around Radix with Tailwind classes.

Exports needed:
- `DropdownMenu` (Root)
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `DropdownMenuSeparator`

**Step 3: Export from package index**

Verify the package uses path-based exports (e.g., `@tokenization/ui/dropdown-menu`). Check `packages/ui/package.json` exports field and add entry if needed.

**Step 4: Verify build**

Run: `npx turbo run build --filter=@tokenization/ui`
Expected: BUILD SUCCESS

**Step 5: Commit**

```bash
git add packages/ui/src/dropdown-menu.tsx packages/ui/package.json
git commit -m "feat(ui): add DropdownMenu component"
```

---

### Task 2: Add API call function

**Files:**
- Modify: `apps/backoffice-tokenization/src/features/campaigns/services/campaigns.api.ts`

**Step 1: Add `updateRoiPorcentage` function**

Add to the bottom of `campaigns.api.ts`:

```typescript
export async function updateRoiPorcentage(params: {
  contractId: string;
  newRoiPorcentage: number;
  callerPublicKey: string;
}): Promise<{ unsignedXdr: string }> {
  const { data } = await httpClient.post<{ unsignedXdr: string }>(
    "/vault/update-roi-porcentage",
    params,
  );
  return data;
}
```

This calls the existing backend endpoint `POST /vault/update-roi-porcentage` which accepts `{ contractId, newRoiPorcentage, callerPublicKey }` and returns `{ unsignedXdr }`.

**Step 2: Commit**

```bash
git add apps/backoffice-tokenization/src/features/campaigns/services/campaigns.api.ts
git commit -m "feat: add updateRoiPorcentage API call"
```

---

### Task 3: Add `useUpdateRoiPercentage` hook

**Files:**
- Create: `apps/backoffice-tokenization/src/features/campaigns/hooks/useUpdateRoiPercentage.ts`

**Step 1: Create the hook**

Follow the exact pattern of `useToggleVault.ts`:

```typescript
"use client";

import { useState } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { signTransaction } from "@tokenization/tw-blocks-shared/src/wallet-kit/wallet-kit";
import { submitAndExtractAddress } from "@/features/campaigns/services/soroban.service";
import { updateRoiPorcentage } from "@/features/campaigns/services/campaigns.api";

interface UseUpdateRoiPercentageParams {
  onSuccess?: () => void;
}

export function useUpdateRoiPercentage({ onSuccess }: UseUpdateRoiPercentageParams = {}) {
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (vaultContractId: string, newRoiPorcentage: number) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { unsignedXdr } = await updateRoiPorcentage({
        contractId: vaultContractId,
        newRoiPorcentage,
        callerPublicKey: walletAddress,
      });

      const signedXdr = await signTransaction({
        unsignedTransaction: unsignedXdr,
        address: walletAddress,
      });

      await submitAndExtractAddress(signedXdr);

      onSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error };
}
```

**Step 2: Commit**

```bash
git add apps/backoffice-tokenization/src/features/campaigns/hooks/useUpdateRoiPercentage.ts
git commit -m "feat: add useUpdateRoiPercentage hook"
```

---

### Task 4: Add `UpdateRoiDialog` component

**Files:**
- Create: `apps/backoffice-tokenization/src/features/campaigns/components/roi/UpdateRoiDialog.tsx`

**Step 1: Create the dialog**

Follow the exact pattern of `FundRoiDialog.tsx`:

```typescript
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@tokenization/ui/dialog";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Label } from "@tokenization/ui/label";
import { Loader2 } from "lucide-react";
import { useUpdateRoiPercentage } from "@/features/campaigns/hooks/useUpdateRoiPercentage";
import { toast } from "sonner";

interface UpdateRoiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
  vaultId: string;
  onUpdated: () => void;
}

export function UpdateRoiDialog({
  open,
  onOpenChange,
  campaignName,
  vaultId,
  onUpdated,
}: UpdateRoiDialogProps) {
  const [percentage, setPercentage] = useState("");

  const { execute, isSubmitting, error } = useUpdateRoiPercentage({
    onSuccess: () => {
      toast.success("ROI percentage updated successfully");
      onUpdated();
      onOpenChange(false);
      setPercentage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(percentage);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return;
    execute(vaultId, parsed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full! sm:max-w-lg!">
        <DialogHeader>
          <DialogTitle>Update ROI Percentage — {campaignName}</DialogTitle>
          <DialogDescription>
            Set a new ROI percentage for this campaign's vault. Value must be between 0 and 100.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="roiPercentage">ROI Percentage (%)</Label>
            <Input
              id="roiPercentage"
              type="number"
              step="1"
              min="0"
              max="100"
              placeholder="e.g. 12"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Vault:{" "}
            <span className="font-mono text-foreground">{vaultId}</span>
          </p>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting || !percentage}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating ROI...</span>
              </div>
            ) : (
              "Update ROI Percentage"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Commit**

```bash
git add apps/backoffice-tokenization/src/features/campaigns/components/roi/UpdateRoiDialog.tsx
git commit -m "feat: add UpdateRoiDialog component"
```

---

### Task 5: Replace inline buttons with actions dropdown in ROI table row

**Files:**
- Modify: `apps/backoffice-tokenization/src/features/campaigns/components/roi/roi-table-row.tsx`
- Modify: `apps/backoffice-tokenization/src/features/campaigns/components/roi/types.ts`

**Step 1: Update types to support the new callback**

Add `onUpdateRoi` callback to `RoiTableRowProps` in `types.ts`:

```typescript
export interface RoiTableRowProps {
  campaign: Campaign;
  balance: number;
  onAddFunds: (campaign: Campaign) => void;
  onUpdateRoi: (campaign: Campaign) => void;
}
```

Also add to `RoiTableProps`:

```typescript
export interface RoiTableProps {
  campaigns: Campaign[];
  onAddFunds: (campaign: Campaign) => void;
  onUpdateRoi: (campaign: Campaign) => void;
}
```

**Step 2: Refactor `roi-table-row.tsx`**

Replace the inline buttons in the `<TableCell className="text-right">` with a `DropdownMenu`. The dropdown trigger is an "Actions" button with a `MoreHorizontal` icon. Menu items:
- "Gestionar Prestamos" (link to loans page)
- "Toggle Vault" (enable/disable)
- "Subir Fondos" (calls `onAddFunds`)
- Separator
- "Actualizar ROI" (calls `onUpdateRoi`)

Key imports to add:
```typescript
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@tokenization/ui/dropdown-menu";
```

**Step 3: Pass `onUpdateRoi` through `roi-table.tsx`**

Update `RoiTable` to accept and forward `onUpdateRoi` prop to each `RoiTableRow`.

**Step 4: Verify build**

Run: `npx turbo run build --filter=backoffice-tokenization`
Expected: BUILD SUCCESS

**Step 5: Commit**

```bash
git add apps/backoffice-tokenization/src/features/campaigns/components/roi/
git commit -m "feat: replace inline buttons with actions dropdown in ROI table"
```

---

### Task 6: Wire up UpdateRoiDialog in roi-view.tsx

**Files:**
- Modify: `apps/backoffice-tokenization/src/features/campaigns/components/roi/roi-view.tsx`
- Modify: `apps/backoffice-tokenization/src/features/campaigns/hooks/use-roi.ts`

**Step 1: Add ROI dialog state to `use-roi.ts` hook**

Add state management for the Update ROI dialog following the same pattern as `fundsDialogCampaign`:

```typescript
const [roiDialogCampaign, setRoiDialogCampaign] = useState<Campaign | null>(null);
const [roiDialogOpen, setRoiDialogOpen] = useState(false);

function openRoiDialog(campaign: Campaign) {
  setRoiDialogCampaign(campaign);
  setRoiDialogOpen(true);
}

function closeRoiDialog() {
  setRoiDialogOpen(false);
  setRoiDialogCampaign(null);
}
```

Return all new values from the hook.

**Step 2: Update `roi-view.tsx`**

- Import `UpdateRoiDialog`
- Destructure `roiDialogCampaign`, `roiDialogOpen`, `openRoiDialog`, `closeRoiDialog` from `useRoi()`
- Pass `onUpdateRoi={openRoiDialog}` to `<RoiTable>`
- Render `<UpdateRoiDialog>` alongside `<FundRoiDialog>` in the dialogs section

**Step 3: Verify build**

Run: `npx turbo run build --filter=backoffice-tokenization`
Expected: BUILD SUCCESS

**Step 4: Commit**

```bash
git add apps/backoffice-tokenization/src/features/campaigns/components/roi/ apps/backoffice-tokenization/src/features/campaigns/hooks/use-roi.ts
git commit -m "feat: wire UpdateRoiDialog into ROI view"
```
