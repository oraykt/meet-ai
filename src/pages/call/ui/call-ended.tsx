import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CallEnded = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary/75 from-sidebar-accent to-sidebar-accent p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-6 md:p-8">
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-lg md:text-xl font-medium">You have ended the call</h6>
          <p className="text-sm md:text-base text-muted-foreground">
            Summary will appear in a few minutes
          </p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/meetings">Back to meetings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
