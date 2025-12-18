import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
      <CommandList className="p-1">
        <CommandItem onSelect={() => setOpen(false)}>Meeting 1</CommandItem>
        <CommandItem onSelect={() => setOpen(false)}>Meeting 2</CommandItem>
        <CommandItem onSelect={() => setOpen(false)}>Agent Alpha</CommandItem>
        <CommandItem onSelect={() => setOpen(false)}>Agent Beta</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
