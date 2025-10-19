import {z} from "zod"

export const messageSchema = z.object({
    content : z
        .string()
        .min(10,"Content msut be at least of 10 chars")
        .max(300,"Content must be no longer than 300 chars")
})