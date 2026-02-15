"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/loading";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PdfQuiz() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("0");
    const [document, setDocument] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (status === "loading") return <Loading />;

    const isNumberOfQuestionsValid = numberOfQuestions!="0" && parseInt(numberOfQuestions) >= 1 && parseInt(numberOfQuestions) <= 30;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!document) {
            setError("Please select a PDF file");
            return;
        }
        
        if (!title) {
            setError("Please enter a quiz title");
            return;
        }
        
        if (!isNumberOfQuestionsValid) {
            setError("Number of questions must not be greater than 30");
            return;
        }
        
        setLoading(true);
        setError("");
        
        try {
            const formData = new FormData();
            formData.append('document', document);
            formData.append('title', title);
            formData.append('numberOfQuestions', numberOfQuestions);
            
            const newQuizId = crypto.randomUUID();
            console.log(newQuizId);
            
            const res = await fetch(`/api/quiz/${newQuizId}/createquiz/uploadpdf`, {
                method: "POST",
                body: formData,
            });
            
            if (!res.ok) {
                throw new Error("Failed to create quiz");
            }
            
            router.push(`/dashboard`);
        } catch (error) {
            console.error(error);
            setError("Failed to create quiz. Please try again.");
        } finally {
            setLoading(false);
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
                    Create Quiz from PDF!
                </h1>

                {/* Quiz Details */}
                <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <form className="w-full" onSubmit={handleSave}>
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        <p className="text-white mt-4 mb-2">Number of Questions:</p>
                        <input
                            type="number"
                            placeholder="Number of questions"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(e.target.value)}
                            min="1"
                            max="30"
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        <label className='mt-4 bg-slate-700 w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative cursor-pointer'>
                            <div className='absolute inset-0 m-auto flex justify-center items-center text-white'>
                                {document?.name || "Drag and drop your PDF file here..."}
                            </div>
                            <input
                                type="file"
                                accept="application/pdf"
                                className='relative block w-full h-full z-50 opacity-0 cursor-pointer'
                                onChange={(e) => setDocument(e.target.files?.[0] || null)}
                            />
                        </label>
                        {error && <p className='text-red-500 mt-2'>{error}</p>}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-5 w-5" />
                            {loading ? "Generating Quiz..." : "Generate Quiz"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
