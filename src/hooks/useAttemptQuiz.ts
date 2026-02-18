import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/quiz";

export function useAttemptQuiz() {
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

  return {
    // State
    quiz,
    currentQuestion,
    selectedAnswer,
    showResult,
    score,
    isAnswered,
    loading,
    answers,
    session,
    status,
    
    // Actions
    handleAnswerClick,
    handleNextQuestion,
    handleRestartQuiz,
  };
}
