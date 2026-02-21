"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { pageContainer } from "@/styles/variables";

// UI Components
import { Loading } from "@/components/loading";
import { Manual } from "@/components/createquiz/manual";
import { AuthBar } from "@/components/auth/auth-bar";

// Hooks
import { useCreateQuiz } from "@/hooks/useCreateQuiz";
import { useManualQuiz } from "@/hooks/useManualQuiz";


export default function ManualQuiz() {

  const { data: session, status } = useSession();
  const quiz = useManualQuiz();
  const { saveQuiz, loading } = useCreateQuiz();

  if (status === "loading") return <Loading />;

  return (
    <div className={pageContainer}>

      {session && <AuthBar name={session?.user?.name} email={session?.user?.email} showDashboardButton={true} showCreateQuizButton={false}/>}
      <Manual {...quiz} handleSave={() => saveQuiz(quiz.title, quiz.description, "manual", "", quiz.questions)} loading={loading}/>
    </div>
  );
}
