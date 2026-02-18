import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question } from "@/types/questions";

export function useEditQuiz() {
  const params = useParams();
  const quizId = params.id as string;
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/quiz/${quizId}`);
      if (!res.ok) {
        toast.error("Failed to fetch quiz! Try again!");
        throw new Error("Failed to fetch quiz");
      }
      const quizData = await res.json();
      setTitle(quizData.title || "");
      setDescription(quizData.description || "");
      setQuestions(quizData.questions || []);
    } catch (error) {
        toast.error("Error fetching quiz");
        throw new Error(`Error: ${error}`);
    } finally {
        setLoading(false);
    }
  }, [quizId]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: "",
      options: [
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };

  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId
                  ? { ...o, isCorrect: true }
                  : { ...o, isCorrect: false }
              ),
            }
          : q
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          questions: questions,
        })
      });
      if (!res.ok) {
        toast.error("Failed to update quiz");
        throw new Error("Failed to update quiz");
      }
      if (res.ok) {
        toast.success("Quiz updated successfully");
        router.push(`/dashboard`);
      }
    } catch (error) {
      toast.error("Failed to update quiz");
      throw new Error(`Error: ${error}`);
    } finally {
        setSaving(false);
    }
  };

  return {
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
  };
}
