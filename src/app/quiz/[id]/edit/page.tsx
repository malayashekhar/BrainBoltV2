"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { pageContainer } from "@/styles/variables";

// UI Components
import { Loading } from "@/components/loading";
import { AuthBar } from "@/components/auth/auth-bar";
import { EditQuizComponent } from "@/components/quiz/edit";

// Hooks
import { useEditQuiz } from "@/hooks/useEditQuiz";

export default function EditQuiz() {
  const { data: session, status } = useSession();
  const {
    title,
    description,
    questions,
    loading,
    saving,
    setTitle,
    setDescription,
    fetchQuiz,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateOption,
    setCorrectOption,
    handleSave,
  } = useEditQuiz();

  useEffect(() => {
    if (status === "authenticated") {
      fetchQuiz();
    }
  }, [status, fetchQuiz]);

  if (status === "loading" || loading) return <Loading />;

  return (
    <div className={pageContainer}>
      {session && <AuthBar name={session.user?.name} email={session.user?.email} showDashboardButton={true} showCreateQuizButton={false} />}
      <EditQuizComponent 
        title={title} 
        description={description} 
        questions={questions} 
        saving={saving} 
        setTitle={setTitle} 
        setDescription={setDescription} 
        removeQuestion={removeQuestion} 
        updateQuestion={updateQuestion} 
        updateOption={updateOption} 
        setCorrectOption={setCorrectOption} 
        addQuestion={addQuestion} 
        handleSave={handleSave}
      />
    </div>
  );
}
