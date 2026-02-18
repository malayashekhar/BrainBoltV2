import { Option } from "./option";

export interface Question {
  id: string;
  text: string;
  quizId?: string;
  options: Array<Option>

  createdAt?: Date;
  updatedAt?: Date;
}