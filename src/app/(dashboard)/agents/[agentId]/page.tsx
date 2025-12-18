import { ErrorState } from "@/components/error-state";
import { AgentViewById } from "@/pages/agents/ui/agent-view-by-id";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ agentId: string }>;
}
// localhost:3000/dashboard/agents/123 ->agentId

const Page = async ({ params }: Props) => {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ErrorBoundary fallback={<ErrorState />}>
          <AgentViewById agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
