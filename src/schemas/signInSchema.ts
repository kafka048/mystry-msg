import { z } from "zod"

export const signInSchema = z.object({
    identifier: z.string(), // this can either be email or username
    password: z.string()
})
