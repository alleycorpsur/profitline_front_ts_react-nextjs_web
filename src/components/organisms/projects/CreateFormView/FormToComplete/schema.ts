export enum QuestionType {
  MULTIPLE_CHOICE = "multiple-choice", //answer: number[]
  SINGLE_CHOICE = "single-choice", //answer: number
  TEXT = "text", //answer: string
  FILE = "file", //answer: string
  NUMBER = "number", //answer: number
  DATE = "date" //answer: string
}

export interface Option {
  value: number;
  label: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  description: string;
  isRequired: boolean;
  options?: Option[];
}

export type Answer = number | number[] | string | File;

export interface FormValues {
  answers: { value: Answer }[];
}

export interface FormLoaded {
  formName: string;
  formDescription: string;
  validity: number; // En años
  questions: Question[];
}

export const defaultFormLoaded = {
  formName: "",
  formDescription: "",
  validity: 1,
  questions: []
};
