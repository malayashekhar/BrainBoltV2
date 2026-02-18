export interface QuizShare {
  id: string;
  quizId: string;
  shareKey: string;
  expiresAt?: string | null;
  createdAt: string;
}