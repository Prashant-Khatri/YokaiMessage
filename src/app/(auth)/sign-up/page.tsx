"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUp.schema"
import axios, { AxiosError } from "axios"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ApiResponse } from "@/types/ApiResponse"

function page(){
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router=useRouter()
  const form=useForm({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
        username : "",
        email : "",
        password : ""
    }
  })
  useEffect(()=>{
    const checkUsernameUnique=async ()=>{
        if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
                const response=await axios.get(`/api/check-username-unique?username=${username}`)
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError=error as AxiosError<ApiResponse>
                setUsernameMessage(
                    axiosError.response?.data.message ?? "Error checking username"
                )
            }finally{
                setIsCheckingUsername(false)
            }
        }
    }
    checkUsernameUnique()
  },[username])
  const onSubmit=async (data : z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
        const response=await axios.post('/api/sign-up',data)
        toast.success(response.data.message)
        router.replace(`/verify/${username}`)
    } catch (error) {
        console.error("Error in signup of user",error)
        const axiosError=error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message)
    }finally{
        setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 space-y-8 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 text-gray-900">
                Join Yokai Message
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
                Sign up to start your anonymous adventure
            </p>
            </div>

            {/* Form */}
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter username"
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                        }}
                        className="text-sm sm:text-base"
                        />
                    </FormControl>

                    {/* Username validation + spinner */}
                    <div className="flex items-center gap-2 mt-1">
                        {isCheckingUsername && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        )}
                        <p
                        className={`text-sm ${
                            usernameMessage === 'Username is unique'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                        >
                        {usernameMessage}
                        </p>
                    </div>

                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Email Field */}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter your email"
                        {...field}
                        className="text-sm sm:text-base"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Password Field */}
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter password"
                        {...field}
                        type="password"
                        className="text-sm sm:text-base"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Submit Button */}
                <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold"
                >
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                ) : (
                    'Sign Up'
                )}
                </Button>
            </form>
            </Form>

            {/* Footer */}
            <div className="text-center mt-4">
            <p className="text-sm sm:text-base text-gray-600">
                Already a member?{' '}
                <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium"
                >
                Sign in
                </Link>
            </p>
            </div>
        </div>
        </div>
  )
}

export default page