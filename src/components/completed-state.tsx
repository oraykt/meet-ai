import { MeetingGetOne } from "@/pages/meetings/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  BookOpenTextIcon,
  BrainIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
} from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "./generated-avatar";
import { Badge } from "./ui/badge";
import { formatDuration } from "date-fns";
import Markdown from "react-markdown";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=actiove]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>

              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=actiove]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=actiove]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>

              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=actiove]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BrainIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        <TabsContent value="summary" className="bg-white rounded-lg border p-4">
          <div className="bg-white rounded-lg border">
            <div className="p-4 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p className="text-sm text-muted-foreground">
                  {new Date(data.startedAt!).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-x-2 items-center">
                <BrainIcon className="size-4" />
                <p>General Summary</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <ClockFadingIcon className="text-primary" />
                {formatDuration(
                  { seconds: Math.round(data.duration) },
                  { format: ["hours", "minutes", "seconds"] }
                )}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => <h1 className="text-2xl font-medium mb-4" {...props} />,
                    h2: (props) => <h2 className="text-xl font-medium mb-4" {...props} />,
                    h3: (props) => <h3 className="text-lg font-medium mb-4" {...props} />,
                    h4: (props) => <h4 className="text-base font-medium mb-4" {...props} />,
                    p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    li: (props) => <li className="mb-4" {...props} />,
                    strong: (props) => <strong className="font-semibold" {...props} />,
                    code: (props) => <code className="bg-muted px-1 rounded" {...props} />,
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 border-primary pl-4 italic mb-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recording" className="bg-white rounded-lg border p-4">
          <video src={data.recordingUrl!} className="w-full rounded-lg" controls></video>
        </TabsContent>

        <TabsContent value="chat"></TabsContent>
      </Tabs>
    </div>
  );
};
