"use client";
import React from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/loading";
import { Pencil, Sparkles, FileUp } from "lucide-react";

export default function CreateQuiz() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Boxes animation (DO NOT wrap or z-index this) */}
      <Boxes />

      {/* Mask overlay ABOVE boxes */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />

      {/* Auth bar */}
      {session && (
        <div className="z-30 mb-8 flex gap-3 absolute top-4 left-4 right-4 flex-row items-center justify-between">
          <span className="text-sm sm:text-base text-white text-center sm:text-left">
            Welcome, {session.user?.name || session.user?.email}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="self-center sm:self-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="self-center sm:self-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main */}
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
            onClick={() => (window.location.href = "/createquiz/manual")}
            className="w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Pencil className="h-5 w-5" />
            Create Quiz Manually
          </button>

          <button
            onClick={() => (window.location.href = "/createquiz/prompt")}
            className="w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer" 
          >
            <Sparkles className="h-5 w-5" />
            Create Quiz Using AI
          </button>

          <button
            onClick={() => (window.location.href = "/createquiz/uploadpdf")}
            className="w-full max-w-md px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
          >
            <FileUp className="h-5 w-5" />
            Create Quiz Using AI with PDF Upload
          </button>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-12 px-6 py-2 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          ← Back to Home
        </button>
      </main>
    </div>
  );
}
