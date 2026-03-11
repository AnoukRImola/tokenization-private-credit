"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Search, Plus } from "lucide-react";

export function FlowTesting() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [searchId, setSearchId] = useState("");

  if (!walletAddress) {
    return (
      <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          Conecta tu wallet para continuar
        </p>
      </main>
    );
  }

  const handleSearch = () => {
    const trimmed = searchId.trim();
    if (!trimmed) return;
    router.push(`/flow-testing/${trimmed}`);
  };

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">campañas</h1>

        <div className="flex flex-col gap-6 max-w-2xl">
          {/* Create new campaign */}
          <Button
            onClick={() => router.push("/flow-testing/create")}
            className="cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva campaña
          </Button>

          {/* Search escrow */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Buscar escrow por Contract ID
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Contract ID (ej: CABC...XYZ)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={!searchId.trim()}
                className="cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
