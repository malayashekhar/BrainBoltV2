import { Question } from "@/types/questions";

export interface ManualProps {
    title: string;
    setTitle: (e: string) => void;
    description: string;
    setDescription: (e: string) => void;
    questions: Question[];
    removeQuestion: (e: string) => void;
    updateQuestion: (e1: string, e2: string) => void;
    setCorrectOption: (e1: string, e2: string) => void;
    updateOption: (e1: string, e2: string, e3: string) => void;
    addQuestion: () => void;
    handleSave: () => void;
    loading: boolean;
}