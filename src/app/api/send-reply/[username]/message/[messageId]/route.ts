import { sendReplyEmail } from "@/helpers/sendReplyEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export async function POST(req : Request,{ params }: { params: { username: string; messageId: string } }){
    try {
        const {email,reply}=await req.json();
        const {username,messageId}=params;
        await dbConnect()
        const user=await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 401})
        }
        const message=user.messages.find(message=>message._id.toString()===messageId)
        if(!message){
            return Response.json({
                success : false,
                message : "Message not found"
            },{status : 401})
        }
        message.reply=reply;
        await user.save()
        const replyEmail=await sendReplyEmail(email,message.content,reply,username as string)
        return Response.json({
            success : true,
            message : "Reply Sent successfully"
        },{status : 200})
    } catch (error) {
        console.log("Error in sending reply",error)
        const axiosError=error as AxiosError<ApiResponse>
        return Response.json({
            success : false,
            message : axiosError.response?.data.message
        },{status : 500})
    }
}