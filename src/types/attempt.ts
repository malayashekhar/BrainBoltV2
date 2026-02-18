export interface Attempt {
  id: string;

  userId: string;
  quizId: string;

  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;

  createdAt: string;
}