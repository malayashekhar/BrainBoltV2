import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateQuizForUploadPDF() {

    const router = useRouter();
    const [title, setTitle] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");
    const [document, setDocument] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const isNumberOfQuestionsValid = numberOfQuestions!="" && parseInt(numberOfQuestions) >= 1 && parseInt(numberOfQuestions) <= 30;

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!document) {
            toast.error("Please select a PDF file");
            return;
        }
        
        if (!title) {
            toast.error("Please enter a quiz title");
            return;
        }
        
        if (!isNumberOfQuestionsValid) {
            toast.error("Number of questions must not be greater than 30")
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('document', document);
            formData.append('title', title);
            formData.append('numberOfQuestions', numberOfQuestions);
            
            const newQuizId = crypto.randomUUID();
            
            const res = await fetch(`/api/quiz/${newQuizId}/createquiz/uploadpdf`, {
                method: "POST",
                body: formData,
            });
            
            if (!res.ok) {
                toast.error("Failed to create quiz");
                throw new Error("Failed to create quiz");
            }
            toast.success("Quiz created succesfully")
            router.push(`/dashboard`);
        } catch (error) {
            toast.error("Failed to create quiz! Please try again.");
            throw new Error(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return { 
        title,
        setTitle,
        numberOfQuestions,
        setNumberOfQuestions,
        document,
        setDocument,
        loading,
        handleSave 
    }
    
}