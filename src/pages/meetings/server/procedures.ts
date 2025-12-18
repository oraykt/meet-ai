import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingInsertSchema, meetingUpdateSchema } from "../schemas";
// import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
  // Fully audited & secured way to provide CRUD operations via TRPC
  // use protectedProcedure

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const {
      auth: {
        user: { id: authorizedUserId },
      },
    } = ctx;
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, authorizedUserId)));

    if (!existingMeeting) {
      throw new TRPCError({ code: "NOT_FOUND", message: `Agent not found` });
    }
    return existingMeeting;
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
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);
      // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay
      // throw new TRPCError({
      //   code: "NOT_FOUND",
      //   message: "Test error from meetingsRouter.getMany",
      // });

      return {
        items: data,
        page,
        pageSize,
        totalPages,
        total: total.count,
      };
    }),

  create: protectedProcedure.input(meetingInsertSchema).mutation(async ({ input, ctx }) => {
    const { name, agentId } = input;
    const {
      auth: {
        user: { id: userId },
      },
    } = ctx;
    const [createdMeeting] = await db
      .insert(meetings)
      .values({
        name,
        agentId,
        userId,
      })
      .returning();

    // TODO: Create Stream Call, Upsert Stream Users
    return createdMeeting;
  }),

  // remove: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const [removedAgent] = await db
  //       .delete(agents)
  //       .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))
  //       .returning();

  //     if (!removedAgent) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Agent not found",
  //       });
  //     }

  //     return removedAgent;
  //   }),

  update: protectedProcedure.input(meetingUpdateSchema).mutation(async ({ ctx, input }) => {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(input)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
      .returning();
    if (!updatedMeeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meeting not found",
      });
    }

    return updatedMeeting;
  }),
});
