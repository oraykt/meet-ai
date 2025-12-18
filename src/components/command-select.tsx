import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandInput, CommandItem, CommandResponsiveDialog } from "./ui/command";
import { CommandEmpty } from "cmdk";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const handleOpenChange = (open: boolean) => {
    onSearch?.("");
    setOpen(open);
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        {options.map((option) => {
          console.log("Option: ", option);
          return (
            <CommandItem
              value={option.value}
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          );
        })}

        <CommandEmpty>
          <span className="text-muted-foreground text-sm">No options found</span>
        </CommandEmpty>
      </CommandResponsiveDialog>
    </>
  );
};
