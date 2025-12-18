"use client";

import { columns } from "@/pages/agents/ui/columns";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../hooks/use-agents-filters";
import { DataPagination } from "@/components/data-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();
  const trpc = useTRPC();
  const {
    data: { items: agents, page, pageSize, total, totalPages },
  } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ ...filters }));
  return (
    <div className="flex-1 flex flex-col gap-y-4">
      <DataTable
        data={agents}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={(page) => {
          setFilters({ page });
        }}
        onPageSizeChange={(pageSize) => {
          setFilters({ pageSize });
        }}
      />
      {agents.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with your participants"
        />
      )}
    </div>
  );
};
