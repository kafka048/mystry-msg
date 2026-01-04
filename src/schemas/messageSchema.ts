import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "content must be of atleast 10 characters"})
    .max(300, {message: "content must not exceed the limit of 300 chars"})
})
