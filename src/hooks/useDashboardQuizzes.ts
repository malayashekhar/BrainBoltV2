"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Quiz } from "@/types/quiz";

export function useDashboardQuizzes(status: string) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchQuizzes();
    }
  }, [status]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes");

      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quiz/${quizId}/share`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to share quiz");
      }

      const data = await res.json();
      await navigator.clipboard.writeText(data.shareKey);
      toast.success("Share key copied to clipboard!");
    } catch (error) {
      toast.error("Failed to create share link.");
      console.error(error);
    }
  };

  const handleDelete = async (quizId: string, quizTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      toast.success("Quiz deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete quiz");
      console.error(error);
    }
  };

  return {
    quizzes,
    loading,
    handleShare,
    handleDelete,
    refetch: fetchQuizzes,
  };
}