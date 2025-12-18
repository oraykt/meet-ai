"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;
  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };
  return (
    <div className="mb-2">
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-xl">My Agents</span>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon />
            <span className="hidden md:inline">New Agent</span>
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
