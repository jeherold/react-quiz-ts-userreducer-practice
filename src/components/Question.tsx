import { Action } from '../types/Action';
import { QuestionType } from '../types/QuestionType';
import Options from './Options';

interface QuestionProps {
  question: QuestionType;
  answer: number | null,
  dispatch: React.Dispatch<Action>;
}

const Question: React.FC<QuestionProps> = ({ question, dispatch, answer }) => {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;