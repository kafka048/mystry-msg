"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/src/schemas/signInSchema";
import { ApiResponse } from "@/src/types/apiresponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";

const signInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      redirect: true,
      identifier: data.identifier,
      password: data.password,
    });
    if (!response?.ok) {
      toast("Error", {
        description: response?.error ?? "Sign in failed",
      });
      setIsSubmitting(false);
      return;
    }

    toast("Success", {
      description: "Signed in successfully",
    }); // this toast doesn't work when we let nextauth work the redirection

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-100">
      <section className="w-full max-w-xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Mystery Message
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Sign in to access your private inbox.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Identifier */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-400">
                      Email or Username
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                      />
                    </FormControl>

                    <FormDescription className="text-[11px] text-neutral-500">
                      Your registered email or username.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-400">
                      Password
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-neutral-700"
                      />
                    </FormControl>

                    <FormDescription className="text-[11px] text-neutral-500">
                      Required to confirm account ownership.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-md bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-neutral-400">
            Having trouble signing in?{" "}
            <Link
              href="/forgot-password"
              className="text-neutral-200 hover:underline"
            >
              Reset your password
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default signInPage;
