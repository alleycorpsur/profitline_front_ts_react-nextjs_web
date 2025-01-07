export enum QuestionType {
  MULTIPLE_CHOICE = "multiple-choice",
  SINGLE_CHOICE = "single-choice",
  TEXT = "text",
  FILE = "file",
  NUMBER = "number",
  DATE = "date"
}

export interface Option {
  value: string;
  label: string;
}

export interface Question {
  type: QuestionType | null;
  question: string;
  description: string;
  isRequired: boolean;
  options?: Option[];
  answer?: any; // Depending on type, this can be a string, number, date, file, etc.
}

export interface FormValues {
  formName: string;
  formDescription: string;
  validity: number;
  questions: Question[];
}
