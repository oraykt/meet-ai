"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OctagonAlertIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInViews = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const [pending, setPending] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signIn.email(
      { email: values.email, password: values.password, callbackURL: "/" },
      {
        onSuccess: () => {
          // TODO: Success toast
        },
        onError: ({ error }) => {
          toast.error(error.statusText ? error.statusText : error.message);
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  const onSocialSubmit = (provider: "github" | "google" | "facebook") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          // TODO: Success toast
        },
        onError: ({ error }) => {
          toast.error(error.statusText ? error.statusText : error.message);
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="overflow-hidden p-0 max-w-3xl w-full shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in to your Meet.AI account.</p>
              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="************" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <label className="inline-flex items-center gap-2">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  <span className="text-sm">Remember me</span>
                </label>

                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button type="submit" disabled={pending} className="px-4 py-2">
                  {pending ? "Signing in..." : "Sign in"}
                </Button>

                <Link href="/sign-up" className="text-sm text-gray-600 hover:underline">
                  Create account
                </Link>
              </div>

              {!!error && (
                <Alert className="bg-destructive/10 border-none text-red-600">
                  <OctagonAlertIcon className="h-4 w-4" />
                  <AlertTitle>Error: {error}</AlertTitle>
                </Alert>
              )}

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Continue with
                </span>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  className="w-fit"
                  onClick={() => {
                    onSocialSubmit("google");
                  }}
                >
                  <span className="w-5 h-5 inline-flex">
                    <img
                      src="https://cdn.simpleicons.org/google/4285F4"
                      alt="Google"
                      className="w-full h-full"
                    />
                  </span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  className="w-fit"
                  onClick={() => {
                    onSocialSubmit("github");
                  }}
                >
                  <span className="w-5 h-5 inline-flex">
                    <img
                      src="https://cdn.simpleicons.org/github/181717"
                      alt="GitHub"
                      className="w-full h-full"
                    />
                  </span>
                </Button>
              </div>
            </form>
          </Form>

          <div className="bg-white relative hidden md:flex flex-col gap-y-4 items-center justify-center px-6 py-8">
            <img src="/meet-ai-logo.svg" alt="Meet.AI Logo" className="w-20 h-20" />
            <p className="text-3xl text-center font-semibold text-blue-500">Meet.AI</p>
            <p className="text-center text-sm text-gray-600 max-w-sm">
              Meet.AI helps you generate, manage and collaborate with AI-powered meeting summaries
              and notes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInViews;
