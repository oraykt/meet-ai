"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
  LucideIcon,
} from "lucide-react";
import { MeetingGetMany, MeetingStatus } from "../types";
import humanizeDuration from "humanize-duration";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

export const statusIconMap: Record<MeetingStatus, LucideIcon> = {
  [MeetingStatus.UPCOMING]: ClockArrowUpIcon,
  [MeetingStatus.ACTIVE]: LoaderIcon,
  [MeetingStatus.COMPLETED]: CircleCheckIcon,
  [MeetingStatus.PROCESSING]: LoaderIcon,
  [MeetingStatus.CANCELLED]: CircleXIcon,
};

export const renderStatus = (status: MeetingStatus) => {
  const Icon = statusIconMap[status];
  return <Icon className={cn("size-4", status === MeetingStatus.PROCESSING && "animate-spin")} />;
};

export const statusColorMap: Record<MeetingStatus, string> = {
  [MeetingStatus.UPCOMING]: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  [MeetingStatus.ACTIVE]: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  [MeetingStatus.COMPLETED]: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  [MeetingStatus.PROCESSING]: "bg-gray-300/20 text-gray-800 border-gray-800/5",
  [MeetingStatus.CANCELLED]: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const renderStatusOption = (status: MeetingStatus) => (
  <div
    className={cn(
      "flex items-center gap-x-2 capitalize rounded-md px-2 py-1",
      statusColorMap[status]
    )}
  >
    {renderStatus(status)}
    {status}
  </div>
);

export const meetingsColumns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground ml-2" />
            <span className="text-sm text-muted-foreground max-w-50 truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4"
          />
          <span className="text-sm text-muted-foreground">
            {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status]
          )}
        >
          {renderStatus(row.original.status as keyof typeof statusIconMap)}
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("capitalize [&>svg]:size-4 flex items-center gap-x-2")}
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
      </Badge>
    ),
  },
];
