import { CircleCheckIcon } from "lucide-react";
import { MeetingStatus } from "../types";
import { useMeetingsFilter } from "./hooks/use-meetings-filters";
import { CommandSelect } from "@/components/command-select";
import { renderStatusOption } from "./columns";

const options = (Object.values(MeetingStatus) as MeetingStatus[]).map((status) => ({
  id: status,
  value: status,
  children: renderStatusOption(status),
}));

export const MeetingsStatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilter();
  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
      value={filters.status ?? ""}
    />
  );
};
