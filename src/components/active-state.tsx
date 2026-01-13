import { VideoIcon } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Button } from "./ui/button";
import Link from "next/link";

interface ActiveStateProps {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting is active"
        description="Meeting will end once all participants have left."
        imageUrl="/empty.svg"
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-fit">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Join Meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
