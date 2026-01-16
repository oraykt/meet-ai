import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
  MessageNewEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/app/inngest/client";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-signature") || "";
  const apiKey = request.headers.get("x-api-key") || "";

  if (!signature || !apiKey) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json(
        { message: "Missing meetingId in call custom data" },
        { status: 400 }
      );
    }
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          eq(meetings.status, "upcoming")
          // not(eq(meetings.status, "active")),
          // not(eq(meetings.status, "completed")),
          // not(eq(meetings.status, "cancelled"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { message: "Meeting not found or not in upcoming status" },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), not(eq(meetings.status, "active"))));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ message: "Agent not found for the meeting" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAPI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ message: "Missing meetingId in call cid" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;
    if (!meetingId) {
      return NextResponse.json(
        { message: "Missing meetingId in call custom data" },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updateMeeting] = await db
      .update(meetings)
      .set({ transcriptUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json(
        { message: "Meeting not found to update transcript" },
        { status: 404 }
      );
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updateMeeting.id,
        transcriptUrl: updateMeeting.transcriptUrl!,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updateMeeting] = await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json(
        { message: "Meeting not found to update recording" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json({ status: "ok" });
}
