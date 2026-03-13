"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@tokenization/ui/table";
import { Button } from "@tokenization/ui/button";
import { RoiTableRow } from "./roi-table-row";
import type { RoiTableProps } from "./types";

const PAGE_SIZE = 4;

export function RoiTable({ campaigns, onAddFunds, onUpdateRoi }: RoiTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = campaigns.slice(0, visibleCount);
  const hasMore = visibleCount < campaigns.length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden p-3">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Nombre del Proyecto
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Invertido
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Estado
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-widest text-text-muted text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {visible.map((campaign) => (
            <RoiTableRow
              key={campaign.id}
              campaign={campaign}
              onAddFunds={onAddFunds}
              onUpdateRoi={onUpdateRoi}
            />
          ))}
        </TableBody>
      </Table>

      {hasMore && (
        <div className="flex justify-center mt-3 pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
