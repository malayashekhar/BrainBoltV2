import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question } from "@/types/questions";

export function useCreateQuiz() {
    const router = useRouter();

    const saveQuiz = async (
        title: string,
        description: string,
        requestedBy: string,
        numberOfQuestions?: string,
        questions?: Question[]
    ) => {
        try {
            const quizId = crypto.randomUUID();

            const res = await fetch(
                `/api/quiz/${quizId}/createquiz/${requestedBy}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        quizId,
                        numberOfQuestions,
                        title,
                        description,
                        questions,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to create quiz");
            }

            toast.success("Quiz created successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to create quiz");
            console.error(error);
        }
    };

    return { saveQuiz };
}