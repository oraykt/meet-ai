"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { MeetingViewByIdHeader } from "./meeting-view-by-id-header";
import { UpdateMeetingDialog } from "./update-meetings-dialog";
import { UpcomingState } from "@/components/upcoming-state";
import { ActiveState } from "@/components/active-state";
import { CancelledState } from "@/components/cancelled-state";
import { ProcessingState } from "@/components/processing-state";

interface Props {
  meetingId: string;
}

export const MeetingViewById = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
  const { data, isLoading, isError } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  if (isLoading) {
    return <LoadingState title="Meeting is loading..." />;
  }
  if (isError) {
    return <ErrorState title="Error loading meeting" description="Something went wrong" />;
  }

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        toast.success(`Meeting(${data.name}) successfully deleted`);
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove the meeting`
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 flex flex-col gap-y-4">
        <MeetingViewByIdHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => {
            setUpdateMeetingDialogOpen(true);
          }}
          onRemove={handleRemoveMeeting}
        />
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={handleRemoveMeeting}
            isCancelling={removeMeeting.isPending}
          />
        )}
        {isCancelled && <CancelledState />}
        {isCompleted && (
          <Badge variant="secondary" className="w-fit">
            Completed
          </Badge>
        )}
        {isProcessing && <ProcessingState />}
      </div>
    </>
  );
};
