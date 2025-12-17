"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
      <ul>
        {data?.map((agent) => (
          <li key={agent.id} className="mb-2 p-4 border rounded">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};
