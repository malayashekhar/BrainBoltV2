import { BackBtn } from "../ui/back-btn";
import { Save } from "lucide-react";
import { UploadPdfProps } from "@/types/upload-pdf-props";

export function UploadPdf({ title, setTitle, numberOfQuestions, setNumberOfQuestions, handleSave, document, setDocument, loading}: UploadPdfProps) {
    return (
        <main className="z-30 flex flex-1 flex-col items-center w-full max-w-4xl mx-auto mt-16">
            <BackBtn location={"/createquiz"}/>
            <h1 className="font-bold text-white text-4xl sm:text-5xl mb-8">
                Create Quiz from PDF
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
    )
}