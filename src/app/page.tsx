"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { useSession, signIn, signOut } from "next-auth/react";
import { Loading } from "@/components/loading";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shareKey, setShareKey] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <Loading />;

  const handleShareQuiz = async () => {
    setLoading(true);
    try {
      console.log("Share Key:", shareKey);
      
      if (!shareKey.trim()) {
        alert("Please enter a share key");
        return;
      }
      
      const response = await fetch(`/api/addsharedquiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shareKey: shareKey.trim() }),
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add shared quiz");
      }
      
      alert("Quiz added successfully!");
      router.push("/dashboard");

    } catch (error) {
      console.error("Error adding shared quiz:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add shared quiz";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };


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
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="self-center sm:self-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main */}
      <main className="z-30 flex flex-1 flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <h1
          className={cn(
            "font-bold text-white",
            "text-7xl",
            "mb-8",
          )}
        >
          BrainBolt.
        </h1>

        <div className="w-full max-w-md sm:max-w-xl mb-8">
          <Image
            src="/images/amadeus.png"
            width={800}
            height={800}
            alt="Brain Bolt"
            priority
            className="w-full h-auto rounded-2xl object-contain shadow-2xl shadow-black/40"
          />
        </div>

        <p className="text-base sm:text-xl text-neutral-300 mb-8 px-2">
          Test your knowledge with our AI-Powered interactive quizzes.
        </p>

        {session ? (
          <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="sm:w-auto px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/createquiz")}
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
                onClick={handleShareQuiz}
                className="sm:w-auto px-8 py-3 bg-linear-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-700 transition transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Add Quiz"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Sign in <FcGoogle className="h-5 w-5" />
          </button>
        )}
      </main>

    </div>
  );
}
