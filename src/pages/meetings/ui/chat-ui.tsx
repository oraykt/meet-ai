import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { User } from "better-auth";
import { useEffect, useState } from "react";
import { BrainIcon } from "lucide-react";

import type { Channel as StreamChannel } from "stream-chat";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  useCreateChatClient,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

interface Props {
  meetingId: string;
  meetingName: string;
  user: User;
}

export const ChatUI = ({ meetingId, meetingName, user }: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );
  const [channel, setChannel] = useState<StreamChannel>();

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      ...user,
      image: user.image ?? undefined,
    },
  });

  useEffect(() => {
    if (!client) return;
    const channel = client.channel("messaging", meetingId, {
      members: [user.id],
    });

    setChannel(channel);
  }, [client, meetingId, meetingName, user.id]);

  if (!client || !channel) {
    return (
      <LoadingState
        title="Loading Chat..."
        description="Please wait while we load the chat interface."
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center gap-3 border-b border-slate-700 rounded-xl">
        <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg">
          <BrainIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{meetingName}</h2>
          <p className="text-xs text-slate-300">Chat with AI</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <Chat client={client}>
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </Chat>
      </div>
    </div>
  );
};
