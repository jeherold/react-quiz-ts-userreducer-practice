import { Action } from "../types/Action";

interface TimerProps {
  answer: number | null;
  index: number;
  numQuestions: number;
  dispatch: React.Dispatch<Action>;
}

const NextButton: React.FC<TimerProps> = ({ dispatch, answer, index, numQuestions }) => {
  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'finish' })}
      >
        Finish
      </button>
    );
}

export default NextButton;