export interface PropmtQuizProps {
    title: string;
    setTitle: (e: string) => void;
    numberOfQuestions: string;
    setNumberOfQuestions: (e: string) => void;
    description: string; 
    setDescription: (e: string) => void;
    handleSave: () => void;
}