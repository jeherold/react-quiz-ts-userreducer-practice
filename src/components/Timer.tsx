import { useEffect } from 'react';
import { Action } from '../types/Action';

interface TimerProps {
  secondsRemaining: number | null;
  dispatch: React.Dispatch<Action>;
}

const Timer: React.FC<TimerProps> = ({ dispatch, secondsRemaining }) => {
  const minutes = secondsRemaining !== null ? Math.floor(secondsRemaining / 60) : 0;
  const seconds = secondsRemaining !== null ? secondsRemaining % 60 : 0;
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    // useEffect cleanup - runs after the component is unmounted
    return () => clearInterval(id);
  }, [dispatch]);
  return (
    <div className="timer">
      {minutes < 10 && '0'}
      {minutes}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timer;