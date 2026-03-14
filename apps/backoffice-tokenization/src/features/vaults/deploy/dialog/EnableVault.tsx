import * as React from "react";
import {
  Form,
  FormControl,
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
import { useEnableVault } from "./useEnableVault";
import { useTranslations } from "next-intl";


export const EnableVaultDialog = () => {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("vaults");

  const { form, isSubmitting, error, response, setResponse, handleSubmit } =
    useEnableVault({
      onSuccess: () => {
        setOpen(false);
      },
    });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" type="button" className="cursor-pointer">
            {t("enableVault")}
          </Button>
        </DialogTrigger>
        <DialogContent className="!w-full sm:!max-w-lg max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("enableVault")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <FormField
                control={form.control}
                name="vaultContractAddress"
                rules={{ required: t("validation.vaultAddressRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("vaultContractAddressLabel")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("vaultContractAddressPlaceholder")}
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
                    <span className="ml-2">{t("enabling")}</span>
                  </div>
                ) : (
                  t("enable")
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
