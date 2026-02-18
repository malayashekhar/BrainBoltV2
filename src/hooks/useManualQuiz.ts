import { useState } from "react";
import { Question } from "@/types/questions";

export function useManualQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            text: "",
            options: Array.from({ length: 4 }).map(() => ({
                id: crypto.randomUUID(),
                text: "",
                isCorrect: false,
            })),
        };

        setQuestions((prev) => [...prev, newQuestion]);
    };

    const removeQuestion = (questionId: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    };

    const updateQuestion = (questionId: string, text: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === questionId ? { ...q, text } : q))
        );
    };

    const updateOption = (
        questionId: string,
        optionId: string,
        text: string
    ) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((o) =>
                            o.id === optionId ? { ...o, text } : o
                        ),
                    }
                    : q
            )
        );
    };

    const setCorrectOption = (questionId: string, optionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((o) => ({
                            ...o,
                            isCorrect: o.id === optionId,
                        })),
                    }
                    : q
            )
        );
    };

    return {
        title,
        description,
        questions,
        setTitle,
        setDescription,
        addQuestion,
        removeQuestion,
        updateQuestion,
        updateOption,
        setCorrectOption,
    };
}