import { agentsRouter } from "@/pages/agents/server/procedures";
import { meetingsRouter } from "@/pages/meetings/server/procedures";
import { createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
