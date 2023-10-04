import { Reducer, useEffect, useReducer } from 'react';

import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Timer from './Timer';
import Footer from './Footer';
import { AppState } from '../types/AppState';
import { Action } from '../types/Action';
import { QuestionType } from '../types/QuestionType';
import FetchError from './FetchError';

const SECS_PER_QUESTION = 20;

const initialState: AppState = {
  questions: [],
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  stateError: null,
};

const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      // the following is es2022 supported only and vite does not set that up currently in ts react
      // const question: QuestionType = state.questions.at(state.index);
      // eslint-disable-next-line no-case-declarations
      const question: QuestionType = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore,
      };
    case 'tick':
      return {
        ...state,
        // secondsRemaining: state.secondsRemaining - 1,
        // status: state.secondsRemaining <= 0 ? 'finished' : state.status,
        secondsRemaining: (state.secondsRemaining ?? 0) - 1,
        status: (state.secondsRemaining ?? 0) <= 0 ? 'finished' : state.status,
      };
    default:
      return {
        ...state,
        error: 'Action unknown.',
      };
  }
};

const App: React.FC = () => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  // derived state - can calculate from existing state
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev: number, cur: QuestionType) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json() as Promise<QuestionType[]>)
      .then((data: QuestionType[]) =>
        dispatch({ type: 'dataReceived', payload: data })
      )
      .catch(() => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <FetchError />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
