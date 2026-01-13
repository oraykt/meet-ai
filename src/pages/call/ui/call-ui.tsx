"use client";

import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
}

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow("call");
  };

  const handleLeave = async () => {
    if (!call) return;
    await call.endCall();
    setShow("ended");
  };

  const renderContent = () => {
    switch (show) {
      case "lobby":
        return <CallLobby onJoin={handleJoin} />;
      case "call":
        return <CallActive onLeave={handleLeave} meetingName={meetingName} />;
      case "ended":
        return <CallEnded />;
      default:
        return null;
    }
  };

  return <StreamTheme className="h-screen bg-primary/75">{renderContent()}</StreamTheme>;
};
