"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { HomeView } from "@/pages/home/ui/home-view";
import { useRouter } from "next/navigation";

export const DashboardView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    router.push("/sign-in");
  }

  return (
    <div>
      <HomeView />
    </div>
  );
};
