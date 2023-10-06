import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

const Timer: React.FC = () => {
  const {
    state: { secondsRemaining },
    actions: { dispatch },
  } = useQuiz();

  const minutes =
    secondsRemaining !== null ? Math.floor(secondsRemaining / 60) : 0;
  const seconds = secondsRemaining !== null ? secondsRemaining % 60 : 0;
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    // useEffect cleanup - runs after the component is unmounted
    return () => clearInterval(id);
  }, [dispatch]);
  return (
    <div className="timer">
      {minutes < 10 && "0"}
      {minutes}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
};

export default Timer;
