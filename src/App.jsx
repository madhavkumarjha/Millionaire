import { useState, useMemo } from "react";
import "./App.css";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import allQuestions from "./questions.json";

const TOTAL_QUESTIONS = 15;

const PRIZES = [
  "$ 100",
  "$ 200",
  "$ 300",
  "$ 500",
  "$ 1,000",
  "$ 2,000",
  "$ 4,000",
  "$ 8,000",
  "$ 16,000",
  "$ 32,000",
  "$ 64,000",
  "$ 125,000",
  "$ 250,000",
  "$ 500,000",
  "$ 1,000,000",
];

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// BUG-12: Select 5 Tier 1, 5 Tier 2, 5 Tier 3 questions
function buildQuiz(questions) {
  const tier1 = shuffleArray(questions.filter((q) => q.difficulty === 1)).slice(0, 5);
  const tier2 = shuffleArray(questions.filter((q) => q.difficulty === 2)).slice(0, 5);
  const tier3 = shuffleArray(questions.filter((q) => q.difficulty === 3)).slice(0, 5);

  return [...tier1, ...tier2, ...tier3].map((q, idx) => ({
    ...q,
    gameIndex: idx + 1,
  }));
}

function App() {
  const [username, setUsername] = useState(null);
  const [quiz, setQuiz] = useState(() => buildQuiz(allQuestions));
  const [questionNumber, setQuestionNumber] = useState(1);
  const [status, setStatus] = useState("playing"); // "playing" | "won" | "lost"
  const [locked, setLocked] = useState(false);

  // BUG-10: Derive ladder without storing in state
  const moneyPyramid = useMemo(
    () =>
      PRIZES.map((amount, idx) => ({
        id: idx + 1,
        amount,
        milestone: idx + 1 === 5 || idx + 1 === 10 || idx + 1 === 15,
      })).reverse(),
    []
  );

  // BUG-10: Derive current earned amount directly in render
  const currentEarned = useMemo(() => {
    if (status === "won") return "$ 1,000,000";
    if (status === "lost") {
      if (questionNumber > 10) return "$ 32,000";
      if (questionNumber > 5) return "$ 1,000";
      return "$ 0";
    }
    return questionNumber > 1 ? PRIZES[questionNumber - 2] : "$ 0";
  }, [status, questionNumber]);

  // BUG-03: Timer paused when answer is locked
  const handleAnswerSelect = () => {
    setLocked(true);
  };

  const handleCorrect = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      // BUG-01: Win condition reached
      setStatus("won");
      setLocked(false);
    } else {
      setQuestionNumber((prev) => prev + 1);
      setLocked(false);
    }
  };

  const handleWrong = () => {
    setStatus("lost");
    setLocked(false);
  };

  const handleTimeUp = () => {
    setStatus("lost");
    setLocked(false);
  };

  // BUG-06: Restart without reloading page; preserves username
  const handleRestart = () => {
    setQuiz(buildQuiz(allQuestions));
    setQuestionNumber(1);
    setStatus("playing");
    setLocked(false);
  };

  const handleExit = () => {
    setUsername(null);
    handleRestart();
  };

  // Active question derived directly (no empty flashes)
  const currentQuestion = quiz[questionNumber - 1];

  return (
    <div className="app">
      {!username ? (
        <Start onStart={setUsername} />
      ) : (
        <>
          <div className="main">
            {status === "won" ? (
              <div className="endModal victoryModal">
                <div className="trophy">🏆</div>
                <h2 className="victoryTitle">CONGRATULATIONS, {username.toUpperCase()}!</h2>
                <h1 className="victorySubtitle">YOU ARE A MILLIONAIRE!</h1>
                <div className="prizeBadge">$ 1,000,000</div>
                <p className="endSubtext">You completed all 15 questions perfectly!</p>
                <div className="modalButtons">
                  <button type="button" className="modalButton restartBtn" onClick={handleRestart}>
                    Play Again
                  </button>
                  <button type="button" className="modalButton exitBtn" onClick={handleExit}>
                    Exit to Menu
                  </button>
                </div>
              </div>
            ) : status === "lost" ? (
              <div className="endModal lossModal">
                <div className="gameoverBadge">GAME OVER</div>
                <h2 className="endPlayerName">Well played, {username}</h2>
                <h3 className="endText">Guaranteed Take-Home:</h3>
                <h1 className="endEarned">{currentEarned}</h1>
                <p className="endSubtext">Reached Question {questionNumber} of 15</p>
                <div className="modalButtons">
                  <button type="button" className="modalButton restartBtn" onClick={handleRestart}>
                    Try Again
                  </button>
                  <button type="button" className="modalButton exitBtn" onClick={handleExit}>
                    Exit to Menu
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="top">
                  <div className="hud">
                    <div className="playerChip">👤 {username}</div>
                    <div className="bankChip">💰 {currentEarned}</div>
                    <div className="ladderChip">Question {questionNumber} / 15</div>
                  </div>

                  {/* BUG-03: Key resets timer on each question without effects */}
                  <div className="timer">
                    <Timer
                      key={questionNumber}
                      paused={locked}
                      onTimeUp={handleTimeUp}
                    />
                  </div>
                </div>

                <div className="bottom">
                  {currentQuestion && (
                    <Trivia
                      question={currentQuestion}
                      onAnswerSelect={handleAnswerSelect}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="pyramid">
            <ul className="moneyList">
              {moneyPyramid.map((m) => {
                const isActive = questionNumber === m.id && status === "playing";
                const isPassed = questionNumber > m.id || status === "won";
                let itemClass = "moneyListItem";
                if (isActive) itemClass += " active";
                if (isPassed) itemClass += " passed";
                if (m.milestone) itemClass += " milestone";

                return (
                  <li key={m.id} className={itemClass}>
                    <span className="moneyListItemNumber">{m.id}</span>
                    <span className="moneyListItemAmount">{m.amount}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
