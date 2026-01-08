"use client";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

import { X } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { Message } from "../model/usermodel";
import { ApiResponse } from "../types/apiresponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirmation = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast("Message deleted", {
        description: response.data.message,
      });

      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "Failed to delete message",
      });
    }
  };

  return (
    <Card
      className="
        bg-neutral-950
        border border-neutral-800
        transition
        hover:border-neutral-600
        hover:bg-neutral-900
        hover:shadow-lg
        focus-within:border-neutral-500
        focus-within:ring-1
        focus-within:ring-neutral-500
      "
    >
      <CardContent className="p-5">
        {/* Message content */}
        <p className="text-sm font-medium leading-relaxed text-neutral-100 whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Timestamp */}
        <p className="mt-3 text-xs font-medium text-neutral-400">
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end px-4 pb-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="
                rounded-md
                p-1.5
                text-neutral-400
                hover:text-neutral-100
                hover:bg-neutral-800
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-neutral-500
                transition
              "
              aria-label="Delete message"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-neutral-950 border border-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-neutral-100">
                Delete message?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                This action cannot be undone. The message will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-neutral-700 text-neutral-100 hover:bg-neutral-900">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirmation}
                className="bg-white text-black hover:bg-neutral-200"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
