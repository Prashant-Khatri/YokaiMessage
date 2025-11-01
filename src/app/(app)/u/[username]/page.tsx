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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function SendMessagePage({ params }: { params: { username: string } }){
    const [isSubmitting,setIsSubmitting]=useState(false)
    const [questions,setQuestions]=useState(suggestions)
    const {messages,sendMessage}=useChat()
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
    const onSubmit=async(data : z.infer<typeof messageSchema>)=>{
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
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black py-12 px-6 flex flex-col items-center">
  <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-lg p-8 space-y-8 transition-all">
    <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100">
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
        onClick={() => sendMessage({ text: '' })}
        className="font-medium shadow-sm hover:shadow-md transition-all"
        variant="outline"
      >
        Suggest Message
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
          {questions.length > 0 ? (
            questions.map((q, i) => (
              <Button
                key={i}
                onClick={() => messageCopyToInput(q)}
                className="text-sm text-left justify-start whitespace-normal border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-transform hover:scale-[1.02]"
                variant="outline"
              >
                {q}
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No suggestions yet — click “Suggest Messages” above.
            </p>
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