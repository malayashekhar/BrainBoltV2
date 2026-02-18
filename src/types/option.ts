export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;

  questionId?: string;
  createdAt?: Date;
}