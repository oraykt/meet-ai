"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const {
    data: session,
    isPending, //loading state
    // error, //error object
    // refetch //refetch the session
  } = authClient.useSession()

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = async () => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {
      onError: (ctx) => {
        console.log(ctx)
        alert(`Error: ${ctx.error.message || 'An error occurred'}`);
      },
      onSuccess: (data) => {
        console.log(data)
        alert(`Success! Please check your email to verify your account.`);
      }
    })
  }

  if (isPending) {
    return <div className="p-8">Loading...</div>
  }

  if (session) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <h1>Welcome, {session.user?.name || session.user?.email}!</h1>
        <Button onClick={() => authClient.signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1>Sign Up</h1>
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)}></Input>
      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
      <Button onClick={onSubmit}>
        Sign Up
      </Button>
    </div>
  );
}
