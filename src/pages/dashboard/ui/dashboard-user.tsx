import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardUser = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data: session, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };
  if (isPending || !session?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between rounded-lg border border-border/10 p-2 bg-white/5 hover:bg-white/10"
          >
            {session.user.image ? (
              <Avatar>
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full"
                />
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={session.user.email || "user"}
                className="w-8 h-8 rounded-full"
                variant="initials"
              />
            )}
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0 mx-4">
              <p>{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-center w-full h-full">
              {session.user.image ? (
                <Avatar>
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full"
                  />
                </Avatar>
              ) : (
                <GeneratedAvatar
                  seed={session.user.email || "user"}
                  className="w-8 h-8 rounded-full"
                  variant="initials"
                />
              )}
            </div>
            <DrawerTitle>{session.user.name}</DrawerTitle>
            <DrawerDescription>{session.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
              <CreditCardIcon className="size-4" />
              Billing
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center"
              onClick={onLogout}
            >
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-2 w-full flex gap-3 items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {session.user.image ? (
          <Avatar>
            <AvatarImage
              src={session.user.image}
              alt={session.user.name || "User Avatar"}
              className="w-8 h-8 rounded-full"
            />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={session.user.email || "user"}
            className="w-8 h-8 rounded-full"
            variant="initials"
          />
        )}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p>{session.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{session.user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CreditCardIcon className="size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardUser;
