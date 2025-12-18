"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meetings-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilter } from "./hooks/use-meetings-filters";
import { MeetingsStatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search || !!filters.agentId || !!filters.status;
  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
      agentId: "",
      status: null,
    });
  };
  return (
    <div className="mb-2">
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-xl">My Meetings</span>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon />
            <span className="hidden md:inline">New Meeting</span>
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <MeetingsStatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};
