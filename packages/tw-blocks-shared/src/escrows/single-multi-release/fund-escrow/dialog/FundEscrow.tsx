import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { Input } from "@tokenization/ui/input";
import { Button } from "@tokenization/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tokenization/ui/dialog";
import { Loader2 } from "lucide-react";
import { useFundEscrow } from "./useFundEscrow";
import { useSharedTranslation } from "../../../../i18n/TranslationProvider";

export const FundEscrowDialog = () => {
  const { t } = useSharedTranslation();
  const [open, setOpen] = React.useState(false);
  const { form, handleSubmit, isSubmitting } = useFundEscrow({
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer w-full">
          {t("escrow.fund.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("escrow.fund.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("escrow.fund.amountLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("escrow.fund.amountPlaceholder")}
                      {...field}
                    />
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
                    <span className="ml-2">{t("escrow.fund.submitting")}</span>
                  </div>
                ) : (
                  t("escrow.fund.submit")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
