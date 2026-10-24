import { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import allQuestions from "./questions.json";
import { buildHybridQuiz } from "./services/questionEngine";
import { saveGameSession, getGameHistory } from "./services/db";

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

// Fallback initial quiz builder using local bank
function buildInitialQuiz() {
  const t1 = allQuestions.filter((q) => q.difficulty === 1).slice(0, 5);
  const t2 = allQuestions.filter((q) => q.difficulty === 2).slice(0, 5);
  const t3 = allQuestions.filter((q) => q.difficulty === 3).slice(0, 5);
  return [...t1, ...t2, ...t3].map((q, idx) => ({ ...q, gameIndex: idx + 1 }));
}

function App() {
  const [username, setUsername] = useState(null);
  const [quiz, setQuiz] = useState(buildInitialQuiz);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [status, setStatus] = useState("playing"); // "playing" | "won" | "lost"
  const [locked, setLocked] = useState(false);

  // V2 Features: 50:50 Lifeline, Audio Mute, and IndexedDB Stats
  const [hasUsed5050, setHasUsed5050] = useState(false);
  const [eliminatedAnswers, setEliminatedAnswers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  // Mobile Prize Ladder Slide-Up Drawer
  const [isLadderOpen, setIsLadderOpen] = useState(false);

  // Load fresh 70/30 dynamic questions when starting game
  const loadDynamicQuestions = async () => {
    try {
      const hybridQuiz = await buildHybridQuiz();
      if (hybridQuiz && hybridQuiz.length === 15) {
        setQuiz(hybridQuiz);
      }
    } catch (err) {
      console.warn("Using offline quiz set:", err);
    }
  };

  const handleStartGame = (name) => {
    setUsername(name);
    loadDynamicQuestions();
  };

  // Derive prize pyramid ladder
  const moneyPyramid = useMemo(
    () =>
      PRIZES.map((amount, idx) => ({
        id: idx + 1,
        amount,
        milestone: idx + 1 === 5 || idx + 1 === 10 || idx + 1 === 15,
      })).reverse(),
    []
  );

  // Derive current earned take-home amount
  const currentEarned = useMemo(() => {
    if (status === "won") return "$ 1,000,000";
    if (status === "lost") {
      if (questionNumber > 10) return "$ 32,000";
      if (questionNumber > 5) return "$ 1,000";
      return "$ 0";
    }
    return questionNumber > 1 ? PRIZES[questionNumber - 2] : "$ 0";
  }, [status, questionNumber]);

  // Save session to IndexedDB once upon game completion
  const sessionSavedRef = useRef(false);
  useEffect(() => {
    if ((status === "won" || status === "lost") && !sessionSavedRef.current && username) {
      sessionSavedRef.current = true;
      saveGameSession({
        username,
        earned: currentEarned,
        questionNumber,
        status,
      }).then(() => {
        getGameHistory().then(setGameHistory);
      });
    }
  }, [status, username, currentEarned, questionNumber]);

  // Reset 50:50 eliminated options on question change
  useEffect(() => {
    setEliminatedAnswers([]);
  }, [questionNumber]);

  // 50:50 Lifeline Handler
  const handleUse5050 = () => {
    if (hasUsed5050 || locked || status !== "playing") return;

    const currentQ = quiz[questionNumber - 1];
    if (!currentQ || !currentQ.answers) return;

    const wrongAnswers = currentQ.answers.filter((a) => !a.correct);
    if (wrongAnswers.length < 2) return;

    const shuffledWrong = [...wrongAnswers].sort(() => 0.5 - Math.random());
    const eliminated = [shuffledWrong[0].text, shuffledWrong[1].text];

    setEliminatedAnswers(eliminated);
    setHasUsed5050(true);
  };

  const handleAnswerSelect = () => {
    setLocked(true);
  };

  const handleCorrect = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
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

  // Restart game without page reload
  const handleRestart = () => {
    sessionSavedRef.current = false;
    setQuestionNumber(1);
    setStatus("playing");
    setLocked(false);
    setHasUsed5050(false);
    setEliminatedAnswers([]);
    setIsLadderOpen(false);
    loadDynamicQuestions();
  };

  const handleExit = () => {
    setUsername(null);
    handleRestart();
  };

  const handleOpenStats = async () => {
    const history = await getGameHistory();
    setGameHistory(history);
    setShowStatsModal(true);
  };

  const currentQuestion = quiz[questionNumber - 1];

  // Helper for rendering pyramid rows
  const renderMoneyItem = (m) => {
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
  };

  return (
    <div className="app">
      {!username ? (
        <div className="startContainer">
          <Start onStart={handleStartGame} />
          <button
            type="button"
            className="historyBtn"
            onClick={handleOpenStats}
          >
            📊 View Stats & History
          </button>
        </div>
      ) : (
        <>
          <div className="main">
            {status === "won" ? (
              <div className="endModal victoryModal">
                <div className="trophy">🏆</div>
                <h2 className="victoryTitle">CONGRATULATIONS, {username.toUpperCase()}!</h2>
                <h1 className="victorySubtitle">YOU ARE A MILLIONAIRE!</h1>
                <div className="prizeBadge">$ 1,000,000</div>
                <p className="endSubtext">Saved to your browser's IndexedDB history!</p>
                <div className="modalButtons">
                  <button type="button" className="modalButton restartBtn" onClick={handleRestart}>
                    Play Again
                  </button>
                  <button type="button" className="modalButton statsBtn" onClick={handleOpenStats}>
                    📊 Stats
                  </button>
                  <button type="button" className="modalButton exitBtn" onClick={handleExit}>
                    Exit
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
                  <button type="button" className="modalButton statsBtn" onClick={handleOpenStats}>
                    📊 Stats
                  </button>
                  <button type="button" className="modalButton exitBtn" onClick={handleExit}>
                    Exit
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="top">
                  <div className="hud">
                    <div className="hudGroup">
                      <div className="playerChip">👤 {username}</div>
                      <div className="bankChip">💰 {currentEarned}</div>
                    </div>

                    <div className="hudGroup">
                      <button
                        type="button"
                        className="ladderChipBtn"
                        onClick={() => setIsLadderOpen(true)}
                        title="Click to view full Prize Ladder"
                      >
                        🏆 Q{questionNumber} / 15
                      </button>

                      <div className="actionToolbar">
                        <button
                          type="button"
                          className={`lifelineBtn ${hasUsed5050 ? "used" : ""}`}
                          onClick={handleUse5050}
                          disabled={hasUsed5050 || locked}
                          title={hasUsed5050 ? "50:50 Lifeline already used" : "Use 50:50 Lifeline"}
                        >
                          50:50
                        </button>

                        <button
                          type="button"
                          className="muteBtn"
                          onClick={() => setIsMuted((prev) => !prev)}
                          title={isMuted ? "Unmute Sound" : "Mute Sound"}
                          aria-label="Toggle Sound"
                        >
                          {isMuted ? "🔇" : "🔊"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timer */}
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
                      eliminatedAnswers={eliminatedAnswers}
                      isMuted={isMuted}
                    />
                  )}
                </div>

                {/* Mobile Sleek Milestone Status Bar (Replaces ugly bottom text clutter) */}
                <div className="mobileMilestoneBar" onClick={() => setIsLadderOpen(true)}>
                  <div className="milestoneTarget">
                    {questionNumber <= 5
                      ? "🛡️ Safe Haven: $ 1,000 (Q5)"
                      : questionNumber <= 10
                      ? "🛡️ Safe Haven: $ 32,000 (Q10)"
                      : "🏆 Jackpot: $ 1,000,000 (Q15)"}
                  </div>
                  <button type="button" className="ladderToggleBtn">
                    📜 Prize Ladder ▴
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Desktop Right Sidebar Pyramid (Desktop Only) */}
          <aside className="pyramid desktopOnly">
            <ul className="moneyList">
              {moneyPyramid.map((m) => renderMoneyItem(m))}
            </ul>
          </aside>

          {/* Mobile Slide-Up Prize Ladder Drawer */}
          {isLadderOpen && (
            <div className="ladderDrawerOverlay" onClick={() => setIsLadderOpen(false)}>
              <div className="ladderDrawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawerHeader">
                  <h3 className="drawerTitle">🏆 KBC Prize Ladder</h3>
                  <button
                    type="button"
                    className="drawerCloseBtn"
                    onClick={() => setIsLadderOpen(false)}
                    aria-label="Close Prize Ladder"
                  >
                    ✕
                  </button>
                </div>
                <ul className="moneyList drawerMoneyList">
                  {moneyPyramid.map((m) => renderMoneyItem(m))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {/* IndexedDB Stats & History Modal */}
      {showStatsModal && (
        <div className="statsModalOverlay" onClick={() => setShowStatsModal(false)}>
          <div className="statsModal" onClick={(e) => e.stopPropagation()}>
            <h2 className="statsTitle">📊 Game Records & History</h2>
            <p className="statsSubtitle">Stored locally in your browser's IndexedDB</p>

            <div className="statsSummary">
              <div className="summaryBox">
                <span className="summaryLabel">Total Games</span>
                <span className="summaryValue">{gameHistory.length}</span>
              </div>
              <div className="summaryBox">
                <span className="summaryLabel">Victories</span>
                <span className="summaryValue">
                  {gameHistory.filter((g) => g.status === "won").length}
                </span>
              </div>
            </div>

            <div className="historyList">
              {gameHistory.length === 0 ? (
                <p className="noHistory">No games recorded yet. Play a game to see your stats!</p>
              ) : (
                gameHistory.slice(0, 6).map((item) => (
                  <div key={item.id} className={`historyRow ${item.status}`}>
                    <span className="histPlayer">{item.username}</span>
                    <span className="histEarned">{item.earned}</span>
                    <span className="histQ">Q{item.questionReached}/15</span>
                    <span className="histDate">{item.date}</span>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              className="modalButton closeStatsBtn"
              onClick={() => setShowStatsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
