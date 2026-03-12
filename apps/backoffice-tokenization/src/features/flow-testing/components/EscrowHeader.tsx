import { Button } from "@tokenization/ui/button";
import { ArrowLeft } from "lucide-react";

interface EscrowHeaderProps {
  title: string;
  contractId: string;
  onBack: () => void;
}

export function EscrowHeader({ title, contractId, onBack }: EscrowHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Campanas</h1>
      </div>
      <div className="mb-6 ml-14">
        <p className="text-sm text-muted-foreground">
          {title} &mdash; <code className="text-xs">{contractId}</code>
        </p>
      </div>
    </>
  );
}
