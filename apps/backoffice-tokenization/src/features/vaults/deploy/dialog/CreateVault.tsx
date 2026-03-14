import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { useCreateVault } from "./useCreateVault";
import { numericInputKeyDown, parseNumericInput } from "@/lib/numeric-input";
import { useWatch } from "react-hook-form";
import { VaultDeploySuccessDialog } from "./VaultDeploySuccessDialog";
import { useTranslations } from "next-intl";

export const CreateVaultDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const t = useTranslations("vaults");

  const { form, isSubmitting, error, response, setResponse, handleSubmit } =
    useCreateVault({
      onSuccess: () => {
        setOpen(false);
        setOpenSuccess(true);
      },
    });

  // Realtime derived calculation: interpret input as percentage and show multiplier feedback
  const percentageRaw = useWatch({ control: form.control, name: "price" });
  const percentage = Number.isFinite(Number(percentageRaw))
    ? Number(percentageRaw)
    : 0;
  const multiplier = 1 + percentage / 100;
  const finalPricePerToken = multiplier; // assuming base price = 1

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="cursor-pointer">
            {t("createVault")}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full! sm:max-w-lg! max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <FormField
                control={form.control}
                name="price"
                rules={{
                  required: t("validation.priceRequired"),
                  max: { value: 100, message: t("validation.maxPrice") },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("priceLabel")}<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormDescription>
                      {t("priceDesc")}
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder={t("pricePlaceholder")}
                        autoComplete="off"
                        {...field}
                        onKeyDown={numericInputKeyDown}
                        onChange={(e) => field.onChange(String(parseNumericInput(e.target.value, 100)))}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("multiplier")}:{" "}
                      <span className="font-medium">
                        {Number.isFinite(multiplier)
                          ? multiplier.toFixed(4)
                          : "—"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("pricePerToken")}:{" "}
                      <span className="font-medium">
                        {Number.isFinite(finalPricePerToken)
                          ? finalPricePerToken.toFixed(4)
                          : "—"}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="factoryAddress"
                rules={{ required: t("validation.factoryRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("factoryAddressLabel")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormDescription>
                      {t("factoryAddressDesc")}
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("factoryAddressPlaceholder")}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">{t("creating")}</span>
                  </div>
                ) : (
                  t("createVault")
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <VaultDeploySuccessDialog
        open={openSuccess}
        onOpenChange={(nextOpen) => {
          setOpenSuccess(nextOpen);
          if (!nextOpen) {
            setResponse(null);
          }
        }}
        response={response}
      />
    </>
  );
};
