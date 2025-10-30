import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import dayjs from "dayjs";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.models";
import { toast } from "sonner";
import axios from "axios";

type MessageCardProps={
    message : Message;
    onMessageDelete : (messageId : string)=> void
}
function MessageCard({message,onMessageDelete} : MessageCardProps){
    const handleDeleteConfirm =async ()=>{
        const response=await axios.delete(`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        onMessageDelete(message._id as string)
    }
    return (
        <Card>
        <CardHeader>
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit mx-auto">Delete<X className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p>{message.content}</p>
        </CardContent>
        <CardFooter>
            <p>Received at : {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</p>
        </CardFooter>
        </Card>
    )
}

export default MessageCard;