import { GeneratedAvatar } from '@/components/generated-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDownIcon, CreditCardIcon, LogOutIcon, StarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardUser = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push('/sign-in'),
      },
    });
  };
  if (isPending || !session?.user) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-2 w-full flex gap-3 items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {session.user.image ? (
          <Avatar>
            <AvatarImage
              src={session.user.image}
              alt={session.user.name || 'User Avatar'}
              className="w-8 h-8 rounded-full"
            />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={session.user.email || 'user'}
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
