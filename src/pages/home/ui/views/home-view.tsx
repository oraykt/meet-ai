"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "from HomeView" }));
  return <div className="flex flex-col gap-4 p-8">{data?.greeting}</div>;
};
