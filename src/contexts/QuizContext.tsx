/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useReducer, useEffect } from "react";
import { QuestionType } from "../types/QuestionType";
import { Action } from "../types/Action";

type QuizState = {
  questions: QuestionType[];
  currQuestion: QuestionType | null;
  status: "loading" | "error" | "ready" | "active" | "finished";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  secondsRemaining: number | null;
  stateError: string | null;
  numQuestions: number;
  maxPossiblePoints: number;
};

type QuizActions = {
  dispatch: React.Dispatch<Action>;
};

type QuizContextType = {
  state: QuizState;
  actions: QuizActions;
};

const SECS_PER_QUESTION = 30;

const defaultState: QuizContextType = {
  state: {
    questions: [],
    currQuestion: null,
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
    stateError: null,
    numQuestions: 0,
    maxPossiblePoints: 0,
  },
  actions: {
    dispatch: () => {},
  },
};

const initialState: QuizState = {
  questions: [],
  currQuestion: null,
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  stateError: null,
  numQuestions: 0,
  maxPossiblePoints: 0,
};

const QuizContext = createContext<QuizContextType>(defaultState);

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        currQuestion: action.payload[0],
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
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
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        currQuestion: state.questions[state.index + 1],
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        currQuestion: state.questions[0],
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: (state.secondsRemaining ?? 0) - 1,
        status: (state.secondsRemaining ?? 0) <= 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unkonwn");
  }
}

function QuizProvider({ children }: { children: React.ReactNode }) {
  const [
    {
      questions,
      currQuestion,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev: any, cur: { points: any }) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json() as Promise<QuestionType[]>)
      .then((data: QuestionType[]) =>
        dispatch({ type: "dataReceived", payload: data })
      )
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        state: {
          questions,
          currQuestion,
          status,
          index,
          answer,
          points,
          highscore,
          secondsRemaining,
          stateError: null,
          numQuestions,
          maxPossiblePoints,
        },
        actions: {
          dispatch,
        },
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
