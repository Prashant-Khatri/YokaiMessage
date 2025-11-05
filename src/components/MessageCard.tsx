import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MessageCard({message,onMessageDelete,refresh,username} : any){
    const handleDeleteConfirm =async ()=>{
        const response=await axios.delete(`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        onMessageDelete(message._id as string)
    }
    const replyForm=useForm({
      defaultValues : {
        reply : ""
      }
    })
    const setReply=replyForm.setValue;
    const onSubmit=async(data : any,id : string,email : string)=>{
      try {
        const response=await axios.post(`/api/send-reply/${username}/message/${id}`,{
          email,
          reply : data.reply
        })
        if(response){
          toast.success(response.data.message)
        }else{
          toast.error("Couldn't send reply")
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message)
      }finally{
        refresh()
      }
    }
    return (
          <Card>
        <CardHeader className="flex flex-row justify-between">
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit mx-auto">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {
                      message.isAcceptingReply && message.reply.length===0 &&
                      <Dialog>
                      <DialogTrigger className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-900">
                        Reply
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Reply
                          </DialogTitle>
                          <DialogDescription>
                            Reply to this Yokai user
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...replyForm}>
                        <form onSubmit={replyForm.handleSubmit((data)=>onSubmit(data,message._id as string,message.senderEmail))} className="space-y-8">
                          <FormField
                            control={replyForm.control}
                            name="reply"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Enter your reply here" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Send Reply</Button>
                        </form>
                        </Form>
                        <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" onClick={()=>setReply('reply',"")}>Back</Button>
                        </DialogClose>
                      </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    }
                    {
                      message.isAcceptingReply && message.reply.length>0 &&
                      <Dialog>
                      <DialogTrigger className="bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-900">
                        View Reply
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Your Reply to this message</DialogTitle>
                        </DialogHeader>
                        {message.reply}
                        <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Back</Button>
                        </DialogClose>
                      </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    }
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