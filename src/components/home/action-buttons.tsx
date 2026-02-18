"use client"

import { ActionButtonsProps } from "@/types/action-buttons-props";
import { useRouter } from "next/navigation" 

export function ActionButtons({shareKey, setShareKey, addSharedQuiz, loading} : ActionButtonsProps) {
    const router = useRouter();
    return (
        <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
                onClick={() => router.push("/dashboard")}
                className="sm:w-auto px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer"
            >
                Dashboard
            </button>
            <button
                onClick={() => router.push("/createquiz")}
                className="sm:w-auto px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer"
            >
                Create Quiz
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    placeholder="Share Key"
                    onChange={(e) => setShareKey(e.target.value)}
                    className="px-4 py-3 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                />
                <button
                    onClick={() => addSharedQuiz(shareKey)}
                    className="sm:w-auto px-8 py-3 bg-linear-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-700 transition transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Add Quiz"}
                </button>
            </div>
        </div>
    )
}