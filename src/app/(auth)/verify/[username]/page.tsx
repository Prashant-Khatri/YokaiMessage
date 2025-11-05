"use client"
import { verifySchema } from "@/schema/verify.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";

function verifyAccount(){
    const router=useRouter()
    const params=useParams<{username : string}>()
    const form=useForm({
        resolver : zodResolver(verifySchema),
        defaultValues : {
            code : ""
        }
    })
    const onSubmit=async (data :  z.infer<typeof verifySchema>)=>{
        try {
            const response=await axios.post('/api/verify-code',{
                username : params.username,
                code : data.code
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in verifying code",error)
            const axiosError=error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6">
                Verify Your Account
              </h1>
              <p className="text-sm sm:text-base mb-4">
                Enter the verification code sent to your email
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <Input
                        placeholder="code"
                        {...field}
                        className="text-sm sm:text-base"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold"
                >
                  Verify
                </Button>
              </form>
            </Form>
          </div>
        </div>
    );
}

export default verifyAccount;