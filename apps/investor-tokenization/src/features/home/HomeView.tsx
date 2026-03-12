"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@tokenization/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tokenization/ui/select";
import { ProjectList } from "../transparency/ProjectList";

export const HomeView = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invest in Campaigns</h1>
          <p className="text-muted-foreground">
            Browse and support local entrepreneurship projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="relative rounded-md p-2 hover:bg-accent"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="fundraising">Fundraising</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProjectList search={search} filter={filter} />
    </div>
  );
};
