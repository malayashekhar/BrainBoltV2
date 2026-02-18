"use client"

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export function SignInBtn() {
    return <button
        onClick={() => signIn("google")}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
    >
        Sign in <FcGoogle className="h-5 w-5" />
    </button>
}