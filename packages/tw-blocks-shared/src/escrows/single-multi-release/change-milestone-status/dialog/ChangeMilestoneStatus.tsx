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
import { Textarea } from "@tokenization/ui/textarea";
import { Button } from "@tokenization/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tokenization/ui/dialog";
import { Loader2 } from "lucide-react";
import { useChangeMilestoneStatus } from "./useChangeMilestoneStatus";
import { useEscrowContext } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tokenization/ui/select";
import { useSharedTranslation } from "../../../../i18n/TranslationProvider";

export const ChangeMilestoneStatusDialog = ({
  showSelectMilestone = false,
  milestoneIndex,
}: {
  showSelectMilestone?: boolean;
  milestoneIndex?: number | string;
}) => {
  const { t } = useSharedTranslation();
  const { form, handleSubmit, isSubmitting } = useChangeMilestoneStatus();
  const { selectedEscrow } = useEscrowContext();

  React.useEffect(() => {
    if (
      !showSelectMilestone &&
      milestoneIndex !== undefined &&
      milestoneIndex !== null
    ) {
      form.setValue("milestoneIndex", String(milestoneIndex));
    }
  }, [showSelectMilestone, milestoneIndex, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer w-full">
          {t("escrow.changeStatus.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("escrow.changeStatus.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 w-full"
          >
            <div
              className={`grid grid-cols-1 ${
                showSelectMilestone ? "lg:grid-cols-2" : "lg:grid-cols-1"
              } gap-4`}
            >
              {showSelectMilestone && (
                <FormField
                  control={form.control}
                  name="milestoneIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Milestone
                        <span className="text-destructive ml-1">*</span>
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
                            {(selectedEscrow?.milestones || []).map(
                              (m, idx) => (
                                <SelectItem
                                  key={`ms-${idx}`}
                                  value={String(idx)}
                                >
                                  {m?.description || `Milestone ${idx + 1}`}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t("escrow.changeStatus.newStatusLabel")}<span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("escrow.changeStatus.selectStatus")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evidence</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter evidence (optional)"
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
                    <span className="ml-2">{t("escrow.changeStatus.submitting")}</span>
                  </div>
                ) : (
                  t("escrow.changeStatus.submit")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
