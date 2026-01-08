"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ApiResponse } from "@/src/types/apiresponse";
import { verificationCodeSchema } from "@/src/schemas/verifySchema";
import { useState } from "react";

const verifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast("Success", {
        description: response?.data.message,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        router.replace(`/sign-in`);
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error in verifying the user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast("Error", {
        description: errorMessage,
      });
    }
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
            Enter the verification code sent to your email.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Verification Code */}
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-400">
                      Verification Code
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-600"
                      />
                    </FormControl>

                    <FormDescription className="text-[11px] text-neutral-500">
                      Check your inbox (or spam folder).
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-md bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </div>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer hint */}
          <p className="mt-6 text-center text-sm text-neutral-400">
            Didn’t receive a code?{" "}
            <span className="text-neutral-300">Check spam or try again.</span>
          </p>
        </div>
      </section>
    </main>
  );
};

export default verifyAccount;
