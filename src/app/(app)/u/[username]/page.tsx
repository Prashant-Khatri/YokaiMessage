"use client"
import { Button } from "@/components/ui/button";
import {  Form,FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import * as z from "zod"
import { experimental_useObject as useObject } from '@ai-sdk/react'
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {motion} from 'framer-motion'

function SendMessagePage({ params }: { params: { username: string } }){
    const [isSubmitting,setIsSubmitting]=useState(false)
    const initialMessages=[
        "If you could instantly master any skill, what would it be and why?",
        "What’s a small thing you do that always brightens your day?",
        "If you could relive one moment from your past just for the joy of it, which would you choose?"
    ]
    const [questions,setQuestions]=useState(initialMessages)
    console.log(params)
    const {username}=params;
    console.log(username)
    const form=useForm<z.infer<typeof messageSchema>>({
        resolver : zodResolver(messageSchema),
        defaultValues : {
            content : "",
            isAcceptingReply : false,
            senderEmail : "",
            reply : ""
        }
    })
    const router=useRouter();
    const {watch,formState : {errors},register,setValue}=form;
    const myContent=watch('content')
    const acceptingReply=watch('isAcceptingReply')
    const {object : suggestions,submit,isLoading,error} = useObject({
      api: '/api/suggest-messages',
      schema: z.array(z.string()),
  });
    const onSubmit=async(data : any)=>{
        console.log("Submitting message for user:", username, data);
        setIsSubmitting(true)
        try {
            const response=await axios.post('/api/send-message',{
                username,
                content : data.content,
                isAcceptingReply : data.isAcceptingReply,
                senderEmail : data.senderEmail,
                reply : data.reply
            })
            console.log(response)
            toast.success(response.data.message)
            form.reset()
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to send message")
        }finally{
            setIsSubmitting(false)
        }
    }
    const checkChangeHandler=()=>{
        setValue('isAcceptingReply',!acceptingReply)
        setValue('senderEmail',"")
    }
    const messageCopyToInput=(q : string)=>{
        setValue('content',q)
        toast.success("Message copied successfully")
    }
    if (!username) {
    // Avoid rendering mismatch by not rendering dynamic content until client knows it
        return <div>Loading...</div>;
    }
    return (
        <div className="w-full min-h-screen bg-gray-800 py-12 px-6 flex flex-col items-center">
  <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-lg p-8 space-y-8 transition-all">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-gray-900">
      Public Profile Link
    </h1>

    {/* FORM SECTION */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Message Input */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Send Yokai Message to @{username}
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none mt-2 border-gray-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                  placeholder="Type your message here..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </FormItem>
          )}
        />

        {/* Accepting Replies Switch */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            Accept Replies
          </span>
          <Switch
            {...register('isAcceptingReply')}
            checked={acceptingReply}
            onCheckedChange={checkChangeHandler}
          />
        </div>

        {/* Optional Email Input */}
        {acceptingReply && (
          <FormField
            control={form.control}
            name="senderEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Enter Your Email <span className="text-red-400 text-sm">(It will remain hidden from {username})</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    className="mt-2 border-gray-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                  />
                </FormControl>
                {errors.senderEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.senderEmail.message}</p>
                )}
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={myContent.length === 0 || isSubmitting}
          className="w-full font-medium"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Please Wait
            </div>
          ) : (
            'Send It'
          )}
        </Button>
      </form>
    </Form>

    <Separator className="my-8" />

    {/* Suggest Messages Section */}
    <div className="text-center space-y-4">
      <Button
        onClick={()=>submit("")}
        className="font-medium shadow-sm hover:shadow-md transition-all"
        variant="outline" disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Suggestions'}
        {error && <p className="text-red-500">Error: {error.message}</p>}
      </Button>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Click on any message below to select it.
      </p>

      {/* Suggested Messages */}
      <Card className="border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 rounded-xl shadow-sm mt-4">
        <CardTitle className="text-lg font-semibold text-center py-4 border-b border-gray-200 dark:border-zinc-800">
          Messages
        </CardTitle>
        <CardContent className="flex flex-col gap-3 py-4 px-4">
          {suggestions ? (
            suggestions.map((suggestion, i) => (
                <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="border rounded-md bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-fit px-4 py-2 has-[>svg]:px-3"
                onClick={()=>messageCopyToInput(suggestion as string)}
              >
                {suggestion}
              </motion.button>
            ))
          ) : (
            isLoading ? (<Loader2 className="animate-spin mx-auto"></Loader2>) : (
              initialMessages.map((message,i)=>(
                <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="border rounded-md bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-fit px-4 py-2 has-[>svg]:px-3"
                onClick={()=>messageCopyToInput(message as string)}
              >
                {message}
              </motion.button>
              ))
            )
            
          )}
        </CardContent>
      </Card>
    </div>

    {/* Bottom CTA */}
    <div className="pt-6 text-center space-y-2">
      <p className="text-gray-800 dark:text-gray-200 font-medium">
        Get Your Message Board
      </p>
      <Button
        onClick={() => router.replace('/sign-up')}
        variant="default"
        className="w-full font-medium shadow-sm hover:shadow-md transition-all"
      >
        Create Your Account
      </Button>
    </div>
  </div>
</div>

    );
}

export default SendMessagePage;