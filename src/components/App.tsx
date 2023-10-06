import { useQuiz } from "../contexts/QuizContext";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Timer from "./Timer";
import Footer from "./Footer";
import FetchError from "./FetchError";
import FinishedScreen from "./FinishedScreen";

const App: React.FC = () => {
  const {
    state: { status },
  } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <FetchError />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
};

export default App;
