"use client";
import React, { useState, useEffect } from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/loading";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
}

export default function QuizAttempt() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string }[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        }
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && params.id) {
      fetchQuiz();
    }
  }, [status, params.id]);

  const handleAnswerClick = (optionId: string) => {
    if (isAnswered || !quiz) return;
    
    setSelectedAnswer(optionId);
    setIsAnswered(true);
    
    const currentQ = quiz.questions[currentQuestion];
    const selectedOpt = currentQ.options.find((opt) => opt.id === optionId);
    
    if (selectedOpt?.isCorrect) {
      setScore(score + 1);
    }

    // Store answer for submission
    setAnswers([...answers, { questionId: currentQ.id, optionId }]);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      submitResults();
    }
  };

  const submitResults = async () => {
    if (!quiz || !session?.user?.email) return;

    try {
      const res = await fetch(`/api/quiz/${params.id}/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          score,
          totalQuestions: quiz.questions.length,
        }),
      });

      if (!res.ok) {
        console.error("Failed to submit results");
      }
    } catch (error) {
      console.error("Failed to submit results:", error);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsAnswered(false);
    setAnswers([]);
  };

  if (status === "loading" || loading) return <Loading />;

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
              onClick={() => (window.location.href = "/dashboard")}
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        
        <div className="relative z-30 max-w-2xl w-full mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h1 className="text-5xl font-bold text-white mb-6">Quiz Complete! 🎉</h1>
            <div className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 mb-6">
              {score}/{quiz.questions.length}
            </div>
            <p className="text-xl text-gray-300 mb-8">
              You got {score} out of {quiz.questions.length} questions correct!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-8 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      
      <div className="relative z-30 max-w-4xl w-full mx-auto">
        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="text-sm text-gray-400">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {quiz.questions[currentQuestion].text}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quiz.questions[currentQuestion].options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.isCorrect;
              const showCorrect = isAnswered && isCorrect;
              const showIncorrect = isAnswered && isSelected && !isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerClick(option.id)}
                  disabled={isAnswered}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-105",
                    isSelected && !isAnswered && "border-blue-500 bg-blue-500/20",
                    showCorrect && "border-green-500 bg-green-500/20",
                    showIncorrect && "border-red-500 bg-red-500/20",
                    !isSelected && !isAnswered && "border-gray-600 hover:border-gray-500 bg-gray-800/50",
                    isAnswered && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-white">{option.text}</span>
                    {showCorrect && <span className="text-green-400 text-2xl">✓</span>}
                    {showIncorrect && <span className="text-red-400 text-2xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="mt-8 w-full py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
