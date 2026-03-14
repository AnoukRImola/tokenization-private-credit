import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { Button } from "@tokenization/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tokenization/ui/dialog";
import { Loader2 } from "lucide-react";
import { useApproveMilestone } from "./useApproveMilestone";
import { useEscrowContext } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tokenization/ui/select";
import { useSharedTranslation } from "../../../../i18n/TranslationProvider";

export const ApproveMilestoneDialog = () => {
  const { t } = useSharedTranslation();
  const [open, setOpen] = React.useState(false);
  const { form, handleSubmit, isSubmitting } = useApproveMilestone({
    onSuccess: () => setOpen(false),
  });
  const { selectedEscrow } = useEscrowContext();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer w-full">
          {t("escrow.approve.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("escrow.approve.trigger")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="milestoneIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Milestone<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select milestone" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedEscrow?.milestones || []).map((m, idx) => (
                          <SelectItem key={`ms-${idx}`} value={String(idx)}>
                            {m?.description || `Milestone ${idx + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">{t("escrow.approve.approving")}</span>
                  </div>
                ) : (
                  t("escrow.approve.approve")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
