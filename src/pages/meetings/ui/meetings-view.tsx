"use client";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { meetingsColumns } from "./columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "./hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilter();
  const {
    data: { items: meetings, page, pageSize, total, totalPages },
  } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="flex-1 flex flex-col gap-y-4">
      <DataTable data={meetings} columns={meetingsColumns} />
      <DataPagination
        page={page}
        pageSize={pageSize}
        onPageChange={(page) => setFilters({ page })}
        onPageSizeChange={(pageSize) => setFilters({ pageSize })}
        total={total}
        totalPages={totalPages}
      />
      {meetings.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
        />
      )}
    </div>
  );
};
