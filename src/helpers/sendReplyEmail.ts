import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import ReplyEmail from "../../emails/ReplyEmail"

export async function sendReplyEmail(
    email : string,
    message : string,
    reply : string,
    username : string
    ) : Promise<ApiResponse>{
        try{
            await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: `Reply to your Yokai message by ${username}`,
                react: ReplyEmail({message,reply,username})
            });
            return {
                success : true,
                message : "Verification email sent successfully"
            }
        }catch(error){
            console.log("Error sending verification email",error)
            return {
                success : false,
                message : "Failed to send verification email"
            }
        }
    }