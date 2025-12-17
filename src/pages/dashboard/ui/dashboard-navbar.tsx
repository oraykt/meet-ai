"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftOpenIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex p-3 gap-x-2 items-center border-b bg-background/50 backdrop-blur-sm">
        {state === "collapsed" && (
          <img src="/meet-ai-logo.svg" alt="Meet.AI Logo" className="w-8 h-8" />
        )}
        <Button size="icon" variant="ghost" onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
        </Button>
        <Button
          className="h-9 w-60 justify-start font-normal text-muted text-muted-background hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => {
            setCommandOpen((commandOpen) => !commandOpen);
          }}
        >
          <SearchIcon />
          Search...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs hover:bg-muted">⌘</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
};
