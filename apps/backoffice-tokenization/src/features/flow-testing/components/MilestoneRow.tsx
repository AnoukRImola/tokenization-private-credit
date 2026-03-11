import { Button } from "@tokenization/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tokenization/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { Input } from "@tokenization/ui/input";
import { Textarea } from "@tokenization/ui/textarea";
import { Loader2 } from "lucide-react";
import { formatAddress } from "@tokenization/tw-blocks-shared/src/helpers/format.helper";
import { UseFormReturn } from "react-hook-form";

interface MilestoneRowProps {
  index: number;
  description: string;
  receiver: string;
  amount: number;
  status?: string;
  isApproved: boolean;
  isReleased: boolean;
  insufficientFunds: boolean;
  approvingIndex: number | null;
  releasingIndex: number | null;
  onApprove: (index: number) => void;
  onRelease: (index: number) => void;
  onChangeStatusClick: (index: number) => void;
  changeStatusForm: UseFormReturn<{
    milestoneIndex: string;
    status: string;
    evidence: string;
  }>;
  changeStatusSubmit: (e?: React.BaseSyntheticEvent) => void;
  changeStatusSubmitting: boolean;
}

export function MilestoneRow({
  index,
  description,
  receiver,
  amount,
  status,
  isApproved,
  isReleased,
  insufficientFunds,
  approvingIndex,
  releasingIndex,
  onApprove,
  onRelease,
  onChangeStatusClick,
  changeStatusForm,
  changeStatusSubmit,
  changeStatusSubmitting,
}: MilestoneRowProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg px-4 py-3 gap-3">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="font-medium truncate">{description}</span>
        <span className="text-xs text-muted-foreground truncate">
          {formatAddress(receiver)}
        </span>
        {status && (
          <span className="text-xs text-muted-foreground">
            Estado: {status}
          </span>
        )}
      </div>
      <span className="font-semibold whitespace-nowrap">USDC {amount}</span>
      <div className="flex gap-2 shrink-0">
        {/* Change Milestone Status */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer whitespace-nowrap"
              onClick={() => onChangeStatusClick(index)}
            >
              Cambiar estado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar estado del prestamo</DialogTitle>
            </DialogHeader>
            <Form {...changeStatusForm}>
              <form
                onSubmit={changeStatusSubmit}
                className="flex flex-col space-y-4"
              >
                <FormField
                  control={changeStatusForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Estado
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: completed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={changeStatusForm.control}
                  name="evidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidencia</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Evidencia (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={changeStatusSubmitting}
                  className="cursor-pointer"
                >
                  {changeStatusSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Actualizar"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Approve Milestone */}
        <Button
          onClick={() => onApprove(index)}
          disabled={isApproved || isReleased || approvingIndex !== null}
          variant={isApproved ? "secondary" : "outline"}
          size="sm"
          className="cursor-pointer whitespace-nowrap"
        >
          {approvingIndex === index ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isApproved ? (
            "Aprobado"
          ) : (
            "Aprobar"
          )}
        </Button>

        {/* Release Funds - only visible when approved */}
        {isApproved && (
          <Button
            onClick={() => onRelease(index)}
            disabled={isReleased || releasingIndex !== null || insufficientFunds}
            variant={isReleased ? "secondary" : "outline"}
            size="sm"
            className="cursor-pointer whitespace-nowrap"
            title={
              insufficientFunds && !isReleased
                ? "Fondos insuficientes en el escrow"
                : undefined
            }
          >
            {releasingIndex === index ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isReleased ? (
              "Desembolsado"
            ) : (
              "Desembolsar"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
