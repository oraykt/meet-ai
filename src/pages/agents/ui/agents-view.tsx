"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return (
    <div>
      <ResponsiveDialog
        open={false}
        onOpenChange={() => {}}
        title="Test Dialog"
        description="This is a responsive dialog"
      >
        <p>This is a responsive dialog content.</p>
      </ResponsiveDialog>
      <div className="flex flex-col gap-2">
        {agents.map((agent) => (
          <div>{agent.name}</div>
        ))}
      </div>
    </div>
  );
};
