import { Question } from "./questions";

export interface EditQuizComponentProps {
    title: string;
    description: string;
    questions: Question[];
    saving: boolean;
    setTitle: (e: string) => void;
    setDescription: (e: string) => void;
    removeQuestion: (e: string) => void;
    updateQuestion: (e: string, e2: string) => void;
    updateOption: (e: string, e2: string, e3: string) => void;
    setCorrectOption: (e: string, e2: string) => void;
    addQuestion: () => void;
    handleSave: () => void;
}