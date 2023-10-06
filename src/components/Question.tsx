import { useQuiz } from "../contexts/QuizContext";
import Options from "./Options";

const Question: React.FC = () => {
  const {
    state: { currQuestion },
  } = useQuiz();

  return (
    <div>
      <h4>{currQuestion ? currQuestion.question : "Unknown Question"}</h4>
      <Options />
    </div>
  );
};

export default Question;
