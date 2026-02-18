"use client"

import { cn } from "@/lib/utils";
import { Pencil, Sparkles, FileUp } from "lucide-react";
import { BackBtn } from "../ui/back-btn";
import { useRouter } from "next/navigation";

export function ActionButtons() {
    const router = useRouter();
    return (
        <main className="z-30 flex flex-1 flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <h1
                className={cn(
                    "font-bold text-white",
                    "text-5xl sm:text-6xl",
                    "mb-4",
                )}
            >
                Create Quiz
            </h1>

            <p className="text-base sm:text-xl text-neutral-300 mb-12 px-2">
                Choose how you want to create your quiz
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-6">
                <button
                    onClick={() => router.push("/createquiz/manual")}
                    className="w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <Pencil className="h-5 w-5" />
                    Create Quiz Manually
                </button>

                <button
                    onClick={() => router.push("/createquiz/prompt")}
                    className="w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <Sparkles className="h-5 w-5" />
                    Create Quiz Using AI
                </button>

                <button
                    onClick={() => router.push("/createquiz/uploadpdf")}
                    className="mb-10 w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <FileUp className="h-5 w-5" />
                    Create Quiz Using AI with PDF Upload
                </button>
            </div>

            <BackBtn location={"/"}/>

        </main>
    )
}