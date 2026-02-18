import { Quiz } from "./quiz"

export interface DashboardTablesProps {
    quizzes: Quiz[];
    handleShare: (quizId: string) => void;
    handleDelete: (quizId: string, quizTitle: string) => void;
}