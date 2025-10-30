"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { messageSchema } from "@/schema/message.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useChat, useCompletion } from '@ai-sdk/react';
import * as z from "zod"
import suggestions from "@/suggestions.json"
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function SendMessagePage(){
    const [isSubmitting,setIsSubmitting]=useState(false)
    const [message,setMessage]=useState("")
    const { messages, sendMessage } = useChat()
    const [questions,setQuestions]=useState(suggestions)
    const params=useParams()
    console.log(params)
    const {username}=params;
    // const { completion, complete, isLoading } = useCompletion({
    //     api : "/api/chat"
    // });
    const form=useForm({
        resolver : zodResolver(messageSchema),
        defaultValues : {
            content : ""
        }
    })
    const router=useRouter();
    const {watch,formState : {errors}}=form;
    const myContent=watch('content')
    const onSubmit=async (data : z.infer<typeof messageSchema>)=>{
        console.log(data)
        setMessage("")
        setIsSubmitting(true)
        try {
            const response=await axios.post('/api/send-message',{
                username : username,
                content : data.content
            })
            console.log(response)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        }finally{
            setIsSubmitting(false)
        }
    }
    // useEffect(() => {
    //     if(!completion) return;
    //     // Split the streamed text by "||"
    //     const parts = completion.split("||").filter(Boolean);
    //     setQuestions(parts);
    // }, [completion]);
    // const getSuggestions=async ()=>{
    //     try {
    //         const response=await axios.post('/api/chat')
    //         const questions=response.data.result;
    //         if(questions.length>0){
    //            setSuggestions(questions) 
    //         }
    //     } catch (error) {
    //         toast.error("Error fetching AI response")
    //     }
    // }
    const copyMessage=(q : string)=>{
        navigator.clipboard.writeText(q)
        toast.success("Message copied successfully")
    }
    return (
        <div>
            <h1>Public Profile Link</h1>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Send Yokai Message to @{username}</FormLabel>
                    <FormControl>
                        <Input placeholder="Type Your Message Here" {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
                {
                    errors.content &&
                    <p className="text-red-500">{errors.content.message}</p> 
                }
                <Button type="submit" disabled={myContent.length===0} variant={"outline"}>
                    {
                        isSubmitting ? (
                            <div>
                                <Loader2></Loader2>
                                Please Wait
                            </div>
                        ) : (<p>Send It</p>)
                    }
                </Button>
            </form>
            </Form>
            <Separator className="my-4"/>
            <Button onClick={()=>sendMessage()} variant={"outline"}>Suggest Messages</Button>
            <p>Click on any message below to select it.</p>
            <Card>
                <CardTitle>Messages</CardTitle>
                <CardContent>
                    {
                        questions.map((q,i)=>(
                            <Input key={i} readOnly type="text" value={q} onClick={()=>copyMessage(q)}/>
                        ))
                    }
                </CardContent>
            </Card>
            <p>Get Your Message Board</p>
            <Button variant={"outline"} onClick={()=>router.replace('/sign-up')}>Create Your Account</Button>
        </div>
    );
}

export default SendMessagePage;