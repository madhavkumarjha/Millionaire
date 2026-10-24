import { useEffect, useState } from "react";

const Timer = ({ paused, onTimeUp }) => {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (paused) return;

    if (timer === 0) {
      onTimeUp();
      return;
    }

    const timerId = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [paused, timer, onTimeUp]);

  return (
    <div
      role="timer"
      aria-label={`Time remaining: ${timer} seconds`}
      className={`timerText ${timer <= 10 ? "urgent" : ""}`}
    >
      {timer}
    </div>
  );
};

export default Timer;
