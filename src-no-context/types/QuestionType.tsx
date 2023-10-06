export type QuestionType = {
  question: string,
  options: string[],
  points: number;
  correctOption: number; // You'd want to replace 'any' with a specific type if possible
  // Add other fields as necessary
};