"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
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
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  // ZOD IMPLEMENTATION
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  }); // Validates the form if it follows the schema upon submission, and only then allows submit functon to work

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking the username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // when we submit we want to show a loader
    // check your backend when you build your frontend functionalities
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data); // sign-up is where the req goes, response is what returns.
      toast("Success", {
        description: response.data.message,
      }); // basic success toast

      setTimeout(() => {
        router.replace(`/verify/${username}`);
      }, 1200);
      
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast("Error", {
        description: errorMessage,
      }); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-100">
      <section className="w-full max-w-xl px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Mystery Message
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Create an account to start receiving anonymous messages.
          </p>
        </div>

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-neutral-300">
                      Username
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                          debounced(e.target.value);
                        }}
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500"
                      />
                    </FormControl>

                    <div className="flex items-center justify-between gap-4">
                      <FormDescription className="text-xs text-neutral-500">
                        This will be visible to others.
                      </FormDescription>

                      {usernameMessage && (
                        <span className="text-xs text-neutral-400 text-right">
                          {usernameMessage === "Username is unique"
                            ? "Available"
                            : usernameMessage}
                        </span>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-neutral-400">
                      Email
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-600"
                      />
                    </FormControl>

                    <FormDescription className="text-[11px] text-neutral-500">
                      For verification and recovery only.
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
                        className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-600"
                      />
                    </FormControl>

                    <FormDescription className="text-[11px] text-neutral-500">
                      Use a strong, unique password.
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
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-neutral-200 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;
