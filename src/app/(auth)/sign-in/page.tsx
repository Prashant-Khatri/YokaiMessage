"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schema/signIn.schema"
import { signIn } from "next-auth/react"

function page(){
  const router=useRouter()
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver : zodResolver(signInSchema),
    defaultValues : {
      identifier : "",
      password : ""
    }
  })
  const onSubmit=async (data : z.infer<typeof signInSchema>)=>{
    const result=await signIn('credentials',{
      redirect : false,
      identifier : data.identifier,
      password : data.password
    })
    if(result?.error){
      toast.error('Incorrect username or password')
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 space-y-8 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 text-gray-900">
            Join Yokai Message
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Sign in to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      {...field}
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 sm:py-3 text-sm sm:text-base font-medium"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page