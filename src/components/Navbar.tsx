"use client"
import React from "react"
import Link from "next/link"
import { useSession ,signOut} from "next-auth/react"
import {User} from 'next-auth'
import { Button } from "./ui/button"


function Navbar(){
    const {data : session}=useSession()
    const user :User=session?.user as User
    console.log("Print")
    console.log(session)
    return (
        <nav className="p-4 sm:p-5 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                {/* Logo */}
                <a href="#" className="text-2xl sm:text-xl font-bold text-center sm:text-left">
                Yokai Message
                </a>

                {/* Conditional Auth Section */}
                {session ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                    <span className="text-sm sm:text-base text-center sm:text-left">
                    Welcome, {user.username || user.email}
                    </span>
                    <Button
                    onClick={() => signOut()}
                    className="w-full sm:w-auto bg-slate-100 text-black cursor-pointer"
                    variant="outline"
                    >
                    Logout
                    </Button>
                </div>
                ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                    <Link href="/sign-in" className="w-full sm:w-auto">
                    <Button
                        className="w-full sm:w-auto bg-slate-100 text-black cursor-pointer"
                        variant="outline"
                    >
                        Login
                    </Button>
                    </Link>
                    <Link href="/sign-up" className="w-full sm:w-auto">
                    <Button
                        className="w-full sm:w-auto bg-slate-100 text-black cursor-pointer"
                        variant="outline"
                    >
                        SignUp
                    </Button>
                    </Link>
                </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;