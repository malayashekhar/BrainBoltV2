"use client";

import React from "react";
import { useRouter } from "next/navigation";

// UI Components
import { Loading } from "@/components/loading";
import { Boxes } from "@/components/ui/background-boxes";
import { AttemptQuiz } from "@/components/quiz/attempt";

// Hooks
import { useAttemptQuiz } from "@/hooks/useAttemptQuiz";

export default function QuizAttempt() {
  const router = useRouter();
  const {
    quiz,
    currentQuestion,
    selectedAnswer,
    showResult,
    score,
    isAnswered,
    loading,
    handleAnswerClick,
    handleNextQuestion,
    handleRestartQuiz,
  } = useAttemptQuiz();

  if (loading) return <Loading />;

  if (!quiz) {
    return (
      <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        
        <div className="relative z-30 max-w-2xl w-full mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-6">Quiz Not Found</h1>
            <p className="text-xl text-gray-300 mb-8">
              The quiz you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AttemptQuiz 
      quiz={quiz} 
      currentQuestion={currentQuestion} 
      selectedAnswer={selectedAnswer} 
      showResult={showResult} 
      score={score} 
      isAnswered={isAnswered} 
      loading={loading} 
      handleAnswerClick={handleAnswerClick} 
      handleNextQuestion={handleNextQuestion} 
      handleRestartQuiz={handleRestartQuiz} 
    />
  );
}
