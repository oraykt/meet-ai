import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  name,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();
  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatarUri({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserMediaPermission = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <p className="text-center">
        Please allow access to your camera and microphone to join the call.
      </p>
    </div>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState, useParticipants } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCamPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCamPermission && hasMicPermission;
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary/75 from-sidebar-accent to-sidebar-accent">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg">
          <div className="flex flex-col gap-y-2 text-center p-4">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserMediaPermission
            }
          />
          <div className="flex gap-x-2">
            <ToggleVideoPreviewButton />
            <ToggleAudioPreviewButton />
          </div>
          <div className="p-4 w-full flex flex-col lg:flex-row gap-2">
            <Button asChild variant="outline" className="w-full lg:flex-1">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin} className="w-full lg:flex-1">
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
