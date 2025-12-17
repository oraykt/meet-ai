import { db } from "@/db";
import { agents } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    // throw new TRPCError({
    //   code: "NOT_FOUND",
    //   message: "Test error from agentsRouter.getMany",
    // });
    return data;
  }),
});
