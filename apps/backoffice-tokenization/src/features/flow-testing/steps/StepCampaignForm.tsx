"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Textarea } from "@tokenization/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@tokenization/ui/form";
import { useCampaignFlow } from "../hooks/useCampaignFlow";

const campaignSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z
    .string()
    .min(
      10,
      "La descripcion debe tener al menos 10 caracteres",
    ),
  poolSize: z.coerce.number().positive("Debe ser mayor a 0"),
  loanDuration: z.coerce
    .number()
    .int()
    .positive("Debe ser mayor a 0"),
  expectedReturn: z.coerce
    .number()
    .positive("Debe ser mayor a 0"),
  loanSize: z.coerce.number().positive("Debe ser mayor a 0"),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface StepCampaignFormProps {
  onNext: () => void;
}

export function StepCampaignForm({
  onNext,
}: StepCampaignFormProps) {
  const { update } = useCampaignFlow();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      poolSize: "" as unknown as number,
      loanDuration: "" as unknown as number,
      expectedReturn: "" as unknown as number,
      loanSize: "" as unknown as number,
    },
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit((data) => {
    update({ campaign: data });
    onNext();
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nueva campaña</h2>
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre
                  <span className="text-destructive ml-1">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de la campaña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descripcion
                  <span className="text-destructive ml-1">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe la campaña..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="poolSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pool Size (USD)
                    <span className="text-destructive ml-1">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duracion del prestamo (meses)
                    <span className="text-destructive ml-1">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Retorno esperado (%)
                    <span className="text-destructive ml-1">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="8.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tamano del prestamo (USD)
                    <span className="text-destructive ml-1">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="cursor-pointer">
              Siguiente
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
