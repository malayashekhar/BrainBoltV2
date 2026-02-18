export interface UploadPdfProps {
    title: string;
    setTitle: (e: string) => void;
    numberOfQuestions: string;
    setNumberOfQuestions: (e: string) => void;
    handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
    document: File | null;
    setDocument: (e: File | null) => void;
    loading: boolean;
}