"use client";

import DashboardLayout from "@/app/(dashboard)/layout";
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const DashboardView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <LoadingState />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>Home View</div>
    </DashboardLayout>
  );
};
