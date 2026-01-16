import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { agents, meetings, processedChatMessages } from "@/db/schema";
import { streamChatClient } from "@/lib/stream-chat";
import { generateAvatarUri } from "@/lib/avatar";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MessageNewEvent {
  type: "message.new";
  user?: { id: string };
  channel_id?: string;
  message?: { id?: string; text?: string };
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  let payload: MessageNewEvent;

  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ status: "ok" });
  }

  if (payload.type !== "message.new") {
    return NextResponse.json({ status: "ok" });
  }

  const userId = payload.user?.id;
  const channelId = payload.channel_id;
  const text = payload.message?.text;
  const messageId = payload.message?.id;

  if (!userId || !channelId || !text || !messageId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Check if this message has already been processed
  const [alreadyProcessed] = await db
    .select()
    .from(processedChatMessages)
    .where(eq(processedChatMessages.messageId, messageId));

  if (alreadyProcessed) {
    return NextResponse.json({ status: "ok", message: "Message already processed" });
  }

  const [existingMeeting] = await db
    .select()
    .from(meetings)
    .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

  if (!existingMeeting) {
    return NextResponse.json({ message: "Existing meeting not found" }, { status: 404 });
  }

  const [existingAgent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, existingMeeting.agentId));

  if (!existingAgent) {
    return NextResponse.json({ message: "Agent not found" }, { status: 404 });
  }

  // Only respond if the message is NOT from the agent
  if (userId === existingAgent.id) {
    return NextResponse.json({ status: "ok" });
  }

  // Mark this message as being processed to prevent duplicates
  try {
    await db.insert(processedChatMessages).values({
      messageId,
      channelId,
    });
  } catch (error) {
    // If insertion fails due to unique constraint, message is already being processed
    return NextResponse.json({ status: "ok", message: "Message already processing" });
  }

  const instructions = `
  You are an AI assistant helping the user revisit a recently completed meeting.
  Below is a summary of the meeting, generated from the transcript:
  
  ${existingMeeting.summary}
  
  The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
  
  ${existingAgent.instructions}
  
  The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
  Always base your responses on the meeting summary above.
  
  You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses.
  
  If the summary does not contain enough information to answer a question, politely let the user know.
  
  Be concise, helpful, and focus on providing accurate information from the meeting.
  `;

  const channel = streamChatClient.channel("messaging", channelId);
  await channel.watch();

  const previousMessages = channel.state.messages
    .slice(-5)
    .filter((msg) => msg.text && msg.text.trim() !== "")
    .map<ChatCompletionMessageParam>((message) => ({
      role: message.user?.id === existingAgent.id ? "assistant" : "user",
      content: message.text!,
    }));

  const GPTResponse = await openaiClient.chat.completions.create({
    messages: [
      { role: "system", content: instructions },
      ...previousMessages,
      { role: "user", content: text },
    ],
    model: "gpt-4o",
  });

  const GPTResponseText = GPTResponse.choices[0]?.message?.content;

  if (!GPTResponseText) {
    return NextResponse.json({ status: "ok" });
  }

  const avatarUrl = generateAvatarUri({
    seed: existingAgent.name,
    variant: "botttsNeutral",
  });

  await streamChatClient.upsertUser({
    id: existingAgent.id,
    name: existingAgent.name,
    image: avatarUrl,
  });

  await channel.sendMessage({
    text: GPTResponseText,
    user: {
      id: existingAgent.id,
      name: existingAgent.name,
      image: avatarUrl,
    },
  });

  return NextResponse.json({ status: "ok" });
}
