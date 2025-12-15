'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { OctagonAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, { message: 'Password should be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const SignUpViews = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 max-w-3xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
              <h2 className="text-2xl font-semibold">Create your account</h2>
              <p className="text-sm text-muted-foreground">
                Start using Meet.AI — it's quick and free.
              </p>

              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <Input type="password" placeholder="Choose a secure password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button type="submit" disabled={pending} className="px-4 py-2">
                  {pending ? 'Creating...' : 'Create account'}
                </Button>

                <button
                  type="button"
                  onClick={() => form.reset()}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>

              {!!error && (
                <Alert className="bg-destructive/10 border-none text-red-600">
                  <OctagonAlertIcon className="h-4 w-4" />
                  <AlertTitle>Error: {error}</AlertTitle>
                </Alert>
              )}
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

export default SignUpViews;
