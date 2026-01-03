import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
  meetingName: string;
  onEdit: () => void;
  onRemove: () => void;
}
export const MeetingViewByIdHeader = ({ meetingId, meetingName, onEdit, onRemove }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl">
              <Link href="/meetings">My Meetings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
              <Link href={`/meetings/${meetingId}`}>{meetingName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-fit flex sm:flex-row md:flex-col gap-2 p-2"
        >
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-2 cursor-pointer border-gray-500/10 hover:bg-gray-500/10 rounded-lg p-1"
          >
            <PencilIcon className="size-4 text-black" />
            <span className="hidden sm:inline">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="flex items-center gap-2 cursor-pointer border-red-600/10 hover:bg-red-600/10 rounded-lg p-1"
          >
            <TrashIcon className="size-4 text-red-600" />
            <span className="hidden sm:inline">Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
