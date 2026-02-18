import { Question } from "./questions";

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
  totalAttempts?: number;
  averageScore?: number | null;
  createdAt?: string;
}