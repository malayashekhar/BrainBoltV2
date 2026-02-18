"use client"

import { BackBtn } from "../ui/back-btn"
import { Play, Edit, Share2, Trash2 } from "lucide-react"
import { DashboardTablesProps } from "@/types/dashboard-tables-props"
import { useRouter } from "next/navigation"

export function DashboardTables({ quizzes, handleShare, handleDelete }: DashboardTablesProps) {
    const router = useRouter();
    return (
        <main className="z-30 flex flex-1 flex-col items-center w-full max-w-6xl mx-auto mt-16">

            <BackBtn location={"/"}/>
            <h1 className="font-bold text-white text-4xl sm:text-5xl mb-8">
                Dashboard
            </h1>

            <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
                {quizzes?.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-400 text-lg mb-4">No quizzes created yet</p>
                        <button
                            onClick={() => router.push("/createquiz")}
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
                                {quizzes?.map((quiz) => (
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
                                            {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "N/A"}
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
    )
}