import { useQuiz } from "../contexts/QuizContext";

const Options: React.FC = () => {
  const {
    state: { currQuestion, answer },
    actions: { dispatch },
  } = useQuiz();

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {currQuestion?.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === currQuestion.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;
