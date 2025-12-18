import { MoveLeftIcon, MoveRightIcon, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { PAGE_SIZE_SELECTION } from "@/constants";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const DataPagination = ({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      {total !== 0 && (
        <>
          <div className="flex-1 text-sm text-muted-foreground">
            Page {page} of {totalPages || 1} (in {total})
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              <MoveLeftIcon />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {pageSize}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PAGE_SIZE_SELECTION.map((size) => (
                  <DropdownMenuItem key={size} onSelect={() => onPageSizeChange(size)}>
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <MoveRightIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
