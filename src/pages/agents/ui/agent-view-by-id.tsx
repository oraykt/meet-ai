"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentViewbyIdHeader } from "./agent-view-by-id-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

interface Props {
  agentId: string;
}

export const AgentViewById = ({ agentId }: Props) => {
  const trpc = useTRPC();

  const { data, isLoading, isError } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  if (isLoading) {
    return <LoadingState title="Agent is loading..." />;
  }
  if (isError) {
    <ErrorState title="Error loading agent" description="Something went wrong" />;
  }
  return (
    <div className="flex-1 flex flex-col gap-y-4">
      <AgentViewbyIdHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="rounded-lg border">
        <div className="p-4 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
            <span className="text-2xl font-medium">{data.name}</span>
          </div>
          <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
            <VideoIcon className="text-blue-600" />
            <span>
              {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
            </span>
          </Badge>

          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
