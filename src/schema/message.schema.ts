import {z} from "zod"

export const messageSchema = z.object({
    content : z
        .string()
        .min(10,"Content must be at least of 10 chars")
        .max(300,"Content must be no longer than 300 chars"),
    isAcceptingReply : z.boolean(),
    senderEmail: z
        .string()
        .refine(
        (val) => val==="" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Must be a valid email"
        ),

  reply: z
        .string()
        .refine(
        (val) => val==="" || val.length >= 2,
        "Reply must be at least 2 characters"
        )
})