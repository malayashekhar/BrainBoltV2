"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/loading";
import { Plus, Trash2, Save, ArrowLeft, Check } from "lucide-react";
import { redirect } from "next/navigation";

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

export default function ManualQuiz() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  if (status === "loading") return <Loading />;

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: "",
      options:
        [
          
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

  // Check if all questions have correct options marked
  const allQuestionsHaveCorrectOption = questions.length === 0 || 
    questions.every(q => q.options.some(o => o.isCorrect));
  
  const allQuestionsHaveText = questions.every(q => q.text !== "");
  const allOptionsHaveText = questions.every(q => q.options.every(o => o.text !== ""));

  const handleSave = async () => {
    try {
      const quizId = crypto.randomUUID(); 
      const res = await fetch(`/api/quiz/${quizId}/createquiz/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quizId,
          title: title,
          description: description,
          questions: questions,
        })
      });
      if (!res.ok) {
        throw new Error("Failed to created quiz");
      }
      if (res.ok) {
        redirect(`/dashboard`);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
              onClick={() => (window.location.href = "/dashboard")}
              className="self-center sm:self-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="self-center sm:self-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="z-30 flex flex-1 flex-col items-center w-full max-w-4xl mx-auto mt-16">
        <button
          onClick={() => (window.location.href = "/createquiz")}
          className="self-start mb-6 flex items-center gap-2 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="font-bold text-white text-4xl sm:text-5xl mb-8">
          Create Quiz Manually
        </h1>

        {/* Quiz Details */}
        <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Quiz Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Questions List */}
        <div className="w-full space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-blue-400 font-semibold">
                  Question {index + 1}
                </span>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter your question"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <button
                      onClick={() => setCorrectOption(question.id, option.id)}
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer",
                        option.isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-slate-600 hover:bg-slate-500"
                      )}
                    >
                      {option.isCorrect && <Check className="h-4 w-4" />}
                    </button>
                    <input
                      type="text"
                      placeholder="Option text"
                      value={option.text}
                      onChange={(e) =>
                        updateOption(question.id, option.id, e.target.value)
                      }
                      className={cn(
                        "flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            
              <p className="mt-4 text-sm text-neutral-400">
                Click the circle to mark the correct answer
              </p>
            </div>
          ))}
        </div>

        {/* Add Question Buttons */}
        <div className="flex gap-4 mt-8">
          {allQuestionsHaveText && allOptionsHaveText ? (
            !allQuestionsHaveCorrectOption && questions.length > 0? (
              <div className="text-yellow-400">
                Please mark the correct option for the question!
              </div>
            ) : (
              <button
                onClick={addQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            )
          ) : (
            <div className="text-yellow-400">
              Please fill all the fields!
            </div>
          )}
        </div>

        {/* Save Button */}
        {title === "" ? (
          <div className="text-yellow-400 mt-8">Please add a title!</div>
        ) : questions.length > 0 && allQuestionsHaveCorrectOption ? (
          <button
            onClick={handleSave}
            className="mt-8 flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer"
          >
            <Save className="h-5 w-5" />
            Save Quiz
          </button>
        ) : null}
      </main>
    </div>
  );
}
