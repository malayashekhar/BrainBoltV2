"use client";

import { signOut } from "next-auth/react";
import { AuthBarProps } from "@/types/auth-bar-props";
import { useRouter } from "next/navigation"

export function AuthBar({ name, email, showDashboardButton, showCreateQuizButton }: AuthBarProps) {
    const router = useRouter();
  return (
    <div className="z-30 mb-8 flex gap-3 absolute top-4 left-4 right-4 flex-row items-center justify-between">
      <span className="text-sm sm:text-base text-white text-center sm:text-left">
        Welcome, {name || email}
      </span>
      <div className="flex gap-2 items-center">
        {showDashboardButton && (
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Dashboard
          </button>
        )}
        {showCreateQuizButton && (
          <button
            onClick={() => router.push("/createquiz")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
          >
            Create Quiz
          </button>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
