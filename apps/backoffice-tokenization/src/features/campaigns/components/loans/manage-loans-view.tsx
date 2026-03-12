"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@tokenization/ui/form";
import { Input } from "@tokenization/ui/input";
import { Textarea } from "@tokenization/ui/textarea";
import { Button } from "@tokenization/ui/button";
import { CheckCircle2, Pencil, Wallet, X, Check } from "lucide-react";
import { useManageLoans } from "@/features/campaigns/hooks/use-manage-loans";
import { numericInputKeyDown, parseNumericInput } from "@/lib/numeric-input";
import { formatCurrency } from "@/lib/utils";

export function ManageLoansView() {
  const {
    form,
    milestones,
    walletAddress,
    editingId,
    editValues,
    setEditValues,
    completeMilestone,
    startEdit,
    cancelEdit,
    saveEdit,
    onSubmit,
  } = useManageLoans();

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`
    : null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Milestones list */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Beneficiarios
        </p>

        {milestones.length === 0 ? (
          <p className="text-sm text-text-muted">No hay hitos registrados.</p>
        ) : (
          milestones.map((milestone) => {
            const isCompleted = milestone.status === "completed";
            const isEditing = editingId === milestone.id;

            if (isEditing) {
              return (
                <div
                  key={milestone.id}
                  className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-card px-4 py-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-muted">Descripción</label>
                    <Input
                      value={editValues.description}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, description: e.target.value }))
                      }
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-muted">Monto (USDC)</label>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        className="pr-14"
                        value={editValues.amount}
                        onKeyDown={numericInputKeyDown}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, amount: parseNumericInput(e.target.value) }))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                        USDC
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      className="cursor-pointer"
                    >
                      <X className="size-3.5" />
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveEdit}
                      className="cursor-pointer"
                    >
                      <Check className="size-3.5" />
                      Guardar
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={milestone.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                  isCompleted
                    ? "border-border bg-secondary/20 opacity-60"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-medium ${isCompleted ? "line-through text-text-muted" : "text-foreground"}`}
                  >
                    {milestone.description}
                  </span>
                  <span
                    className={`text-xs font-semibold ${isCompleted ? "text-text-muted" : "text-primary"}`}
                  >
                    USDC {formatCurrency(milestone.amount)}
                  </span>
                </div>

                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span>Completado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(milestone)}
                      className="cursor-pointer text-text-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => completeMilestone(milestone.id)}
                      className="text-xs uppercase tracking-wide cursor-pointer"
                    >
                      Completar
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add new milestone */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Agregar Nuevo Beneficiario
        </p>

        <div className="rounded-xl border border-border bg-card p-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "La descripción es obligatoria" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Préstamo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el propósito de este hito"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Wallet address preview – read-only */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium leading-none">Dirección ONG</span>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 h-9">
                    <Wallet className="size-3.5 shrink-0 text-text-muted" />
                    {shortAddress ? (
                      <span className="font-mono text-xs text-foreground truncate">
                        {shortAddress}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted italic">Sin wallet conectada</span>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  rules={{
                    required: "El monto es obligatorio",
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto (USDC)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="pr-14"
                            {...field}
                            onKeyDown={numericInputKeyDown}
                            onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">
                            USDC
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Crear Nuevo Hito
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
