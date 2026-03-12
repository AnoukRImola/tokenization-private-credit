"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import type { AddMilestoneFormValues, Milestone } from "@/features/campaigns/types/milestone.types";

const MOCK_MILESTONES: Milestone[] = [
  { id: "1", description: "El ropero de liliana", walletAddress: "0xabc...111", amount: 2000, status: "active" },
  { id: "2", description: "Peluqueria doña maria", walletAddress: "0xabc...222", amount: 2000, status: "active" },
  { id: "3", description: "Restaurante el sabroso", walletAddress: "0xabc...333", amount: 2000, status: "active" },
];

export function useManageLoans() {
  const { walletAddress } = useWalletContext();
  const [milestones, setMilestones] = React.useState<Milestone[]>(MOCK_MILESTONES);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<{ description: string; amount: number }>({
    description: "",
    amount: 0,
  });

  const form = useForm<AddMilestoneFormValues>({
    defaultValues: { description: "", amount: 0 },
    mode: "onChange",
  });

  const completeMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "completed" } : m))
    );
  };

  const startEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditValues({ description: milestone.description, amount: milestone.amount });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = () => {
    if (!editingId) return;
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === editingId ? { ...m, ...editValues } : m
      )
    );
    setEditingId(null);
  };

  const onSubmit = form.handleSubmit((values) => {
    setMilestones((prev) => [
      ...prev,
      { id: Date.now().toString(), ...values, walletAddress: walletAddress ?? "", status: "active" },
    ]);
    form.reset();
  });

  return {
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
  };
}
