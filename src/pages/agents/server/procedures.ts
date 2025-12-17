import { db } from "@/db";
import { agents } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInstanceSchema } from "../schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  // TODO: Change `getOne` to use protectedProcedure
  getOne: baseProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));
    return existingAgent;
  }),

  // TODO: Change `getMany` to use protectedProcedure
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    // throw new TRPCError({
    //   code: "NOT_FOUND",
    //   message: "Test error from agentsRouter.getMany",
    // });
    return data;
  }),

  // Fully audited & secured way to provide Create operation via TRPC
  create: protectedProcedure.input(agentsInstanceSchema).mutation(async ({ input, ctx }) => {
    // const { name, instructions } = input;
    // const { auth: {user: { id } } } = ctx;
    const [createdAgent] = await db
      .insert(agents)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();
    return createdAgent;
  }),
});
