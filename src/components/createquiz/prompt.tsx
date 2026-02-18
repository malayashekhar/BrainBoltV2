import { BackBtn } from "../ui/back-btn";
import { Save } from "lucide-react";
import { PropmtQuizProps } from "@/types/prompt-quiz";

export function PromptTextQuiz({ title, setTitle, numberOfQuestions, setNumberOfQuestions, description, setDescription, handleSave }: PropmtQuizProps) {
    const isNumberOfQuestionsValid = numberOfQuestions != "" && parseInt(numberOfQuestions) >= 1 && parseInt(numberOfQuestions) <= 30;
    return (
        <main className="z-30 flex flex-1 flex-col items-center w-full max-w-4xl mx-auto mt-16">
            <BackBtn location={"/createquiz"} />

            <h1 className="font-bold text-white text-4xl sm:text-5xl mb-8">
                Create Quiz using AI
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
                <input
                    type="text"
                    placeholder="Number of questions"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 mb-4 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Quiz Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Save Button */}
            {title === "" ? (
                <div className="text-yellow-400 mt-8">
                    Please add a title!
                </div>
            ) : !isNumberOfQuestionsValid ? (
                <div className="text-yellow-400 mt-8">
                    Number of Questions must not be greater than 30
                </div>
            ) :
                <button
                    onClick={handleSave}
                    className="mt-8 flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 cursor-pointer"
                >
                    <Save className="h-5 w-5" />
                    Save Quiz
                </button>}
        </main>
    );
}