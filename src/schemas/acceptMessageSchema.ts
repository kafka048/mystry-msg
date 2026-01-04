import {z} from "zod"

export const accepptingMessageSchema = z.object({
    acceptMessages: z.boolean()    
})
