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
import { Card } from "@tokenization/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@tokenization/ui/select";
import { Textarea } from "@tokenization/ui/textarea";
import { useInitializeEscrow } from "./useInitializeEscrow";
import { Trash2, DollarSign, Percent, Loader2 } from "lucide-react";
import Link from "next/link";
import { trustlineOptions } from "@tokenization/tw-blocks-shared/src/wallet-kit/trustlines";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tokenization/ui/dialog";
import { Separator } from "@tokenization/ui/separator";
import { useSharedTranslation } from "../../../../i18n/TranslationProvider";

export const InitializeEscrowDialog = () => {
  const { t } = useSharedTranslation();
  const [open, setOpen] = React.useState(false);
  const {
    form,
    isSubmitting,
    milestones,
    isAnyMilestoneEmpty,
    handleSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
    fillTemplateForm,
  } = useInitializeEscrow({
    onSuccess: () => setOpen(false),
  });

  const handleMilestoneAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }

    // Limit to 2 decimal places
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    // Always keep as string to allow partial input like "0." or "0.5"
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      amount: rawValue,
    };
    form.setValue("milestones", updatedMilestones);
  };

  const handlePlatformFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue.split(".").length > 2) {
      rawValue = rawValue.slice(0, -1);
    }

    // Limit to 2 decimal places
    if (rawValue.includes(".")) {
      const parts = rawValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        rawValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    // Always keep as string to allow partial input like "0." or "0.5"
    form.setValue("platformFee", rawValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer">
          {t("escrow.initialize.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-full sm:!max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("escrow.initialize.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <Link
                className="flex-1"
                href="https://docs.trustlesswork.com/trustless-work/technology-overview/escrow-types"
                target="_blank"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="text-xl font-semibold">
                    {t("escrow.initialize.multiReleaseTitle")}
                  </h2>
                </div>
                <p className="text-muted-foreground mt-1">
                  {t("escrow.initialize.multiReleaseDesc")}
                </p>
              </Link>
              {process.env.NODE_ENV !== "production" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={fillTemplateForm}
                  className="cursor-pointer"
                >
                  {t("escrow.initialize.autofill")}
                </Button>
              )}
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("escrow.initialize.titleLabel")}<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.titlePlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engagementId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("escrow.initialize.engagementLabel")}<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.engagementPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trustline.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("escrow.initialize.trustlineLabel")}<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("escrow.initialize.selectTrustline")} />
                        </SelectTrigger>
                        <SelectContent>
                          {trustlineOptions
                            .filter((option) => option.value)
                            .map((option, index) => (
                              <SelectItem
                                key={`${option.value}-${index}`}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platformFee"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("escrow.initialize.platformFeeLabel")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />
                        <Input
                          placeholder={t("escrow.initialize.platformFeePlaceholder")}
                          className="pl-10"
                          value={form.watch("platformFee")?.toString() || ""}
                          onChange={handlePlatformFeeChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roles.approver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        {t("escrow.initialize.approverLabel")}<span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.approverPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.serviceProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        {t("escrow.initialize.serviceProviderLabel")}
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.serviceProviderPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roles.releaseSigner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        {t("escrow.initialize.releaseSignerLabel")}
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.releaseSignerPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.disputeResolver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        {t("escrow.initialize.disputeResolverLabel")}
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.disputeResolverPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="roles.platformAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center">
                        {t("escrow.initialize.platformLabel")}
                        <span className="text-destructive ml-1">*</span>
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder={t("escrow.initialize.platformPlaceholder")}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t("escrow.initialize.descriptionLabel")}<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("escrow.initialize.descriptionPlaceholder")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="flex items-center">{t("escrow.initialize.milestonesLabel")}</FormLabel>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4">
                  <FormLabel className="flex items-center">
                    {t("escrow.initialize.milestoneDescLabel")}<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                </div>
                <div className="md:col-span-4">
                  <FormLabel className="flex items-center">
                    {t("escrow.initialize.milestoneReceiverLabel")}<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                </div>
                <div className="md:col-span-3">
                  <FormLabel className="flex items-center">
                    {t("escrow.initialize.milestoneAmountLabel")}<span className="text-destructive ml-1">*</span>
                  </FormLabel>
                </div>
              </div>

              {milestones.map((milestone, index) => (
                <div key={index} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4">
                      <Input
                        placeholder={t("escrow.initialize.milestoneDescPlaceholder")}
                        value={milestone.description}
                        onChange={(e) => {
                          const updatedMilestones = [...milestones];
                          updatedMilestones[index].description = e.target.value;
                          form.setValue("milestones", updatedMilestones);
                        }}
                      />
                    </div>

                    <div className="md:col-span-4">
                      <Input
                        placeholder={t("escrow.initialize.milestoneReceiverPlaceholder")}
                        value={milestone.receiver}
                        onChange={(e) => {
                          const updatedMilestones = [...milestones];
                          updatedMilestones[index].receiver = e.target.value;
                          form.setValue("milestones", updatedMilestones);
                        }}
                      />
                    </div>

                    <div className="md:col-span-3 relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <Input
                        className="pl-10"
                        placeholder={t("escrow.initialize.milestoneAmountPlaceholder")}
                        value={milestone.amount?.toString() || ""}
                        onChange={(e) => handleMilestoneAmountChange(index, e)}
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        onClick={() => handleRemoveMilestone(index)}
                        className="p-2 bg-transparent text-red-500 hover:text-red-600"
                        disabled={milestones.length === 1}
                        type="button"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Separator */}
                  {index < milestones.length - 1 && (
                    <Separator className="w-full" />
                  )}

                  {/* Add button */}
                  {index === milestones.length - 1 && (
                    <div className="flex justify-end mt-4">
                      <Button
                        disabled={isAnyMilestoneEmpty}
                        className="w-full md:w-fit md:min-w-40 cursor-pointer"
                        variant="outline"
                        onClick={handleAddMilestone}
                        type="button"
                      >
                        {t("escrow.initialize.addItem")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <Button
                className="w-full md:w-1/4 cursor-pointer"
                type="submit"
                disabled={isAnyMilestoneEmpty || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">{t("escrow.initialize.deploying")}</span>
                  </div>
                ) : (
                  t("escrow.initialize.deploy")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
