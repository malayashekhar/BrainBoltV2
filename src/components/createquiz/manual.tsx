"use client"

import { cn } from "@/lib/utils";
import { ArrowLeft, Trash2, Check, Plus, Save } from "lucide-react"
import { ManualProps } from "@/types/manual-props";
import { useRouter } from "next/navigation";

export function Manual({ title, description, questions, setTitle, setDescription, removeQuestion, updateQuestion, setCorrectOption, updateOption, addQuestion, handleSave }: ManualProps) {
    const allQuestionsHaveCorrectOption = questions.length === 0 ||
        questions.every(q => q?.options?.some(o => o.isCorrect));
    const allQuestionsHaveText = questions.every(q => q?.text !== "");
    const allOptionsHaveText = questions.every(q => q?.options?.every(o => o.text !== ""));
    const router = useRouter();
    return (
        <main className="z-30 flex flex-1 flex-col items-center w-full max-w-4xl mx-auto mt-16">
            <button
                onClick={() => router.push("/createquiz")}
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
                    !allQuestionsHaveCorrectOption && questions.length > 0 ? (
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
    )
}