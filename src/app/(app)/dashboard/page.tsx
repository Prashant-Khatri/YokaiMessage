"use client"
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User.models";
import { acceptMessageSchema } from "@/schema/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Page(){
    const [messages,setMessages]=useState<Message[]>([])
    const [isLoading,setIsLoading]=useState(false)
    const [isSwitchLoading,setIsSwitchLoading]=useState(false)
    const handleDeleteMessage=(messageId : string)=>{
      setMessages(messages.filter(message=>message._id!==messageId))
    }
    const {data : session}=useSession()
    const form=useForm({
        resolver : zodResolver(acceptMessageSchema)
    })
    const {register,setValue,watch}=form;
    const acceptMessages=watch('acceptMessage')
    const fetchAcceptMessage=async ()=>{
        setIsSwitchLoading(true)
        try {
            const response=await axios.get<ApiResponse>('/api/accept-message')
            setValue('acceptMessage',response.data.isAcceptingMessages || false)
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Error fetching message settings")
        }finally{
            setIsSwitchLoading(false)
        }
    }

    const fetchMessages=async (refresh : boolean =false)=>{
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response=await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast.success("Messages Refreshed")
            }
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Error in refreshing messages")
        }finally{
            setIsSwitchLoading(false)
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        if(!session || !session.user){
            return
        }
        fetchMessages()
        fetchAcceptMessage()
    },[session])

    const handleSwitchChange=async ()=>{
        try {
            const response=await axios.post('/api/accept-message',{
                acceptMessages : !acceptMessages
            })
            setValue('acceptMessage',!acceptMessages)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Fail changing messages settings")
        }
    }
    if(!session || !session.user){
        return <div>Please login</div>
    }

    const {username}=session?.user as User
    const baseUrl=`${window.location.protocol}//${window.location.host}`
    const profileUrl=`${baseUrl}/u/${username}`

    const copyToClipboard=()=>{
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL Copied")
    }

    return (
        <div className="my-8 mx-4 sm:mx-6 md:mx-8 lg:mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md w-full max-w-6xl overflow-x-hidden">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-gray-900">
            User Dashboard
          </h1>

          {/* Copy Profile Link Section */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 text-center md:text-left text-gray-800">
              Copy Your Unique Link
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 sm:p-3 text-sm sm:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              />
              <Button
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-slate-100 text-black font-medium hover:bg-slate-200 transition-all"
                variant="outline"
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Switch Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-3">
            <Switch
              {...register('acceptMessage')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-0 sm:ml-2 text-sm sm:text-base">
              Accept Messages:{' '}
              <span className={acceptMessages ? 'text-green-600' : 'text-red-600'}>
                {acceptMessages ? 'On' : 'Off'}
              </span>
            </span>
          </div>

          <Separator />

          {/* Refresh Button */}
          <div className="mt-4 flex justify-center md:justify-end">
            <Button
              className="mt-2 sm:mt-4 bg-gray-50 hover:bg-gray-100 text-gray-800"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Messages Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message._id as string}>
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                    refresh={fetchMessages}
                    username={username}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                No messages to display.
              </p>
            )}
          </div>
        </div>
    )
}

export default Page;