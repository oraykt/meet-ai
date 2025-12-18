import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInstanceSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  // TODO: Change `getOne` to use protectedProcedure
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const {
      auth: {
        user: { id: authorizedUserId },
      },
    } = ctx;
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`12`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(and(eq(agents.id, input.id), eq(agents.userId, authorizedUserId)));

    if (!existingAgent) {
      throw new TRPCError({ code: "NOT_FOUND", message: `Agent not found` });
    }
    return existingAgent;
  }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input: { page, pageSize, search } }) => {
      const data = await db
        .select({
          meetingCount: sql<number>`12`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      // throw new TRPCError({
      //   code: "NOT_FOUND",
      //   message: "Test error from agentsRouter.getMany",
      // });
      return {
        items: data,
        page,
        pageSize,
        totalPages,
        total: total.count,
      };
    }),

  // Fully audited & secured way to provide Create operation via TRPC
  create: protectedProcedure.input(agentsInstanceSchema).mutation(async ({ input, ctx }) => {
    const { name, instructions } = input;
    const {
      auth: {
        user: { id: userId },
      },
    } = ctx;
    const [createdAgent] = await db
      .insert(agents)
      .values({
        name,
        instructions,
        userId,
      })
      .returning();
    return createdAgent;
  }),
});
