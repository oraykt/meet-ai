"use client";

import { columns } from "@/pages/agents/ui/columns";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return (
    <div className="flex-1 flex flex-col gap-y-4">
      <DataTable data={agents} columns={columns} />
      {agents.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with your participants"
        />
      )}
    </div>
  );
};
