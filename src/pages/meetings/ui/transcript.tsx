import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAvatarUri } from "@/lib/avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Highlighter from "react-highlight-words";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = (data ?? []).filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border p-4 flex flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          type="text"
          className="pl-7 h-9 w-60"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item, index) => (
            <div
              key={item.start_ts}
              className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
            >
              <div className="flex gap-x-2 items-center">
                <Avatar className="size-8">
                  <AvatarImage
                    src={
                      item.user.image ??
                      generateAvatarUri({
                        seed: item.user.name || "Unknown User",
                        variant: "initials",
                      })
                    }
                    alt={item.user.name || "User Avatar"}
                  />
                </Avatar>
                <p className="text-sm font-medium">{item.user.name}</p>
                <p className="text-sm text-primary font-medium">
                  {new Date(item.start_ts * 1000).toISOString().slice(11, 19)}
                </p>
                <Highlighter
                  searchWords={[searchQuery]}
                  textToHighlight={item.text}
                  className="text-sm text-neutral-700"
                  highlightClassName="bg-yellow-200"
                  autoEscape={true}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
