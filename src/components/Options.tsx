import { Action } from "../types/Action";
import { QuestionType } from "../types/QuestionType";

interface OptionsProps {
  question: QuestionType;
  answer: number | null;
  dispatch: React.Dispatch<Action>;
}

const Options: React.FC<OptionsProps> = ({ question, dispatch, answer }) => {
  const hasAnswered = answer !== null;

  console.log(answer);

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? 'answer' : ''} ${
            hasAnswered
              ? index === question.correctOption
                ? 'correct'
                : 'wrong'
              : ''
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;