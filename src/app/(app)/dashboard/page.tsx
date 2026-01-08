"use client";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/src/model/usermodel";
import { toast } from "sonner";
import { string } from "zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/src/schemas/messageSchema";
import { acceptingMessageSchema } from "@/src/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/apiresponse";
import { refresh } from "next/cache";
import { User } from "next-auth";
import { Switch } from "@/src/components/ui/switch";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/src/components/MessageCard";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  }; // the message isn't deleted from the array yet, but is rather excluded from the new array of messages
  // concept of optimisitc ui

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema),
  }); // for the switch

  const { register, watch, setValue } = form;
  // have to inject watch to watch something

  const acceptMessages = watch("acceptMessages"); // injected the watch

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get(`/api/accept-messages`);
      setValue(`acceptMessages`, response?.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response?.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast("Error", {
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast("Success", {
        description: response?.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message || "Failed to fetch messages",
      });
    }
  };

  const username  = session?.user?.username;
  if(!username) return null;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Success", {
      description: "URL copied to clipboard.",
    });
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
  <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          View and manage the anonymous messages you receive.
        </p>
      </header>

      {/* Share link */}
      <section className="mb-12 rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="text-sm font-semibold text-neutral-100">
          Your message link
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Share this link so others can send you anonymous messages.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="
              w-full rounded-md
              border border-neutral-700
              bg-neutral-950
              px-3 py-2
              text-sm font-medium text-neutral-100
            "
          />
          <Button
            onClick={copyToClipboard}
            className="bg-white text-black hover:bg-neutral-200"
          >
            Copy
          </Button>
        </div>
      </section>

      {/* Message settings */}
      <section className="mb-12 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-6">
        <div className="max-w-md">
          <h3 className="text-sm font-semibold text-neutral-100">
            Accept messages
          </h3>
          <p className="mt-2 text-sm text-neutral-400">
            Turn this off if you want to stop receiving messages temporarily.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm font-medium text-neutral-100">
            {acceptMessages ? "On" : "Off"}
          </span>
        </div>
      </section>

      {/* Messages header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-100">
          Messages
        </h2>

        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="bg-white text-black hover:bg-neutral-200"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {/* Message list */}
      <section className="space-y-5">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-12 text-center">
            <p className="text-sm font-semibold text-neutral-100">
              No messages yet
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Share your link to start receiving anonymous messages.
            </p>
          </div>
        )}
      </section>

    </div>
  </main>
);


}
export default Dashboard;
