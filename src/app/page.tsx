"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// UI Components
import { Boxes } from "@/components/ui/background-boxes";
import { Loading } from "@/components/loading"
import { AuthBar } from "@/components/auth/auth-bar";
import { Hero } from "@/components/home/hero"
import { ActionButtons } from "@/components/home/action-buttons";
import { SignInBtn } from "@/components/auth/signin-btn";
import { pageContainer, boxContainer } from "@/styles/variables";

// Hooks
import { useShareQuiz } from "@/hooks/useShareQuiz";


export default function Home() {
  const { data: session, status } = useSession();
  const [shareKey, setShareKey] = useState("");
  const { addSharedQuiz, loading } = useShareQuiz();

  if (status === "loading") return <Loading />;
  //   setLoading(true);
  //   try {
  //     console.log("Share Key:", shareKey);

  //     if (!shareKey.trim()) {
  //       alert("Please enter a share key");
  //       return;
  //     }

  //     const response = await fetch(`/api/addsharedquiz`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ shareKey: shareKey.trim() }),
  //     });

  //     const data = await response.json();
  //     console.log("Response:", data);

  //     if (!response.ok) {
  //       throw new Error(data.error || "Failed to add shared quiz");
  //     }

  //     alert("Quiz added successfully!");
  //     router.push("/dashboard");

  //   } catch (error) {
  //     console.error("Error adding shared quiz:", error);
  //     const errorMessage = error instanceof Error ? error.message : "Failed to add shared quiz";
  //     alert(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className={pageContainer}>
      <Boxes />
      <div className={boxContainer} />
      {session && <AuthBar name={session.user?.name} email={session.user?.email} />}

      <main className="z-30 flex flex-1 flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <Hero />
        {session ? (
          <ActionButtons shareKey={shareKey} setShareKey={setShareKey} addSharedQuiz={addSharedQuiz} loading={loading} />
        ) : (
          <SignInBtn />
        )}
      </main>
      
    </div>
  );
}
