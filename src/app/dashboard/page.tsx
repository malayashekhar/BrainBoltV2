"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loading } from "@/components/loading";
import { ArrowLeft, Play, Edit, Share2, Trash2 } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  totalAttempts: number;
  averageScore: number | null;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchQuizzes();
    }
  }, [status]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes", 
        { method: "GET" },
      );
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quiz/${quizId}/share`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.shareKey);
        alert("Share key copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  const handleDelete = async (quizId: string, quizTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        alert("Quiz deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  if (status === "loading" || loading) return <Loading />;

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col px-4 py-12">

      {/* Mask overlay */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />

      {/* Auth bar */}
      {session && (
        <div className="z-30 mb-8 flex gap-3 absolute top-4 left-4 right-4 flex-row items-center justify-between">
          <span className="text-sm sm:text-base text-white text-center sm:text-left">
            Welcome, {session.user?.name || session.user?.email}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/createquiz")}
              className="self-center sm:self-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Create Quiz
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="self-center sm:self-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="z-30 flex flex-1 flex-col items-center w-full max-w-6xl mx-auto mt-16">
        <button
          onClick={() => (window.location.href = "/")}
          className="self-start mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="font-bold text-white text-4xl sm:text-5xl mb-8">
          Dashboard
        </h1>

        {/* Quiz Table */}
        <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg mb-4">No quizzes created yet</p>
              <button
                onClick={() => (window.location.href = "/createquiz")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-neutral-300 font-semibold">Quiz Title</th>
                    <th className="text-left py-3 px-4 text-neutral-300 font-semibold">Created</th>
                    <th className="text-center py-3 px-4 text-neutral-300 font-semibold">Avg Score</th>
                    <th className="text-center py-3 px-4 text-neutral-300 font-semibold">Attempts</th>
                    <th className="text-center py-3 px-4 text-neutral-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-white font-medium">{quiz.title}</div>
                          {quiz.description && (
                            <div className="text-neutral-400 text-sm mt-1">{quiz.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-neutral-300">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-neutral-300">
                          {quiz.averageScore ? `${Math.round(quiz.averageScore)}%` : "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-neutral-300">{quiz.totalAttempts}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => (window.location.href = `/quiz/${quiz.id}/attempt`)}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                            title="Attempt Quiz"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => (window.location.href = `/quiz/${quiz.id}/edit`)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                            title="Edit Quiz"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShare(quiz.id)}
                            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer"
                            title="Share Quiz"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(quiz.id, quiz.title)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                            title="Delete Quiz"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
