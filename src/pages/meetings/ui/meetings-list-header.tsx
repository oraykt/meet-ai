"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingDialog } from "./new-meetings-dialog";
export const MeetingsListHeader = () => {
  // const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const isAnyFilterModified = !!filters.search;
  // const onClearFilters = () => {
  //   setFilters({
  //     search: "",
  //     page: DEFAULT_PAGE,
  //   });
  // };
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
        <div className="flex items-center gap-x-2 p-1">
          TODO: FILTER
          {/* <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
};
