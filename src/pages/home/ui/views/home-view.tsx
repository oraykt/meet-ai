'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const HomeView = () => {
  const router = useRouter();
  const {
    data: session,
    isPending,
    // error, //error object
    // refetch //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-8">
      <p>Welcome to Meet.AI. Logged in as {session?.user?.name}</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push('/sign-in'),
            },
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
};
