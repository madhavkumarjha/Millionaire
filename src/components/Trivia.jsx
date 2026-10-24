import React, { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import play from "../sounds/play.mp3";
import correctSoundFile from "../sounds/correct.mp3";
import wrongSoundFile from "../sounds/wrong.mp3";
import waitSoundFile from "../sounds/wait.mp3";

const Trivia = ({
  question,
  onAnswerSelect,
  onCorrect,
  onWrong,
  eliminatedAnswers = [],
  isMuted = false,
}) => {
  // Phase: "idle" | "selected" | "revealed"
  const [phase, setPhase] = useState("idle");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const [playIntro, { sound: introSound }] = useSound(play, { soundEnabled: !isMuted });
  const [playCorrect] = useSound(correctSoundFile, { soundEnabled: !isMuted });
  const [playWrong] = useSound(wrongSoundFile, { soundEnabled: !isMuted });
  const [playWait, { stop: stopWait }] = useSound(waitSoundFile, {
    loop: true,
    volume: 0.4,
    soundEnabled: !isMuted,
  });

  const timeoutsRef = useRef([]);
  const later = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  // Play intro sound once on mount
  const introPlayedRef = useRef(false);
  useEffect(() => {
    if (!introPlayedRef.current && !isMuted) {
      try {
        playIntro();
      } catch {
        // Autoplay policy
      }
      introPlayedRef.current = true;
    }
  }, [introSound, playIntro, isMuted]);

  // If muted state changes during game, stop wait audio
  useEffect(() => {
    if (isMuted) {
      stopWait();
    }
  }, [isMuted, stopWait]);

  // Cleanup pending timeouts and suspense audio on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      stopWait();
      timeouts.forEach(clearTimeout);
    };
  }, [stopWait]);

  // When question changes, reset phase to idle and clear previous selection
  useEffect(() => {
    setPhase("idle");
    setSelectedAnswer(null);
    setAnnouncement("");
    stopWait();
  }, [question, stopWait]);

  const handleAnswerClick = (answer) => {
    // Prevent clicking eliminated choices or clicking during reveal
    if (phase !== "idle" || eliminatedAnswers.includes(answer.text)) return;

    setPhase("selected");
    setSelectedAnswer(answer);

    // Notify parent that answer is locked (pauses timer)
    if (onAnswerSelect) {
      onAnswerSelect(answer);
    }

    // Play tension wait music during suspense if not muted
    if (!isMuted) {
      try {
        playWait();
      } catch {
        // AudioContext fallback
      }
    }

    // Phase 1: After 3s suspense, reveal correct and wrong choices
    later(3000, () => {
      stopWait();
      setPhase("revealed");

      const correctAnswerObj = question.answers.find((a) => a.correct);
      if (answer.correct) {
        setAnnouncement("Correct!");
      } else {
        setAnnouncement(
          `Wrong. The correct answer was ${correctAnswerObj ? correctAnswerObj.text : ""}.`
        );
      }
    });

    // Phase 2: After 5s total, play result SFX and trigger callback
    later(5000, () => {
      if (answer.correct) {
        if (!isMuted) playCorrect();
        later(1200, () => {
          if (onCorrect) onCorrect();
        });
      } else {
        if (!isMuted) playWrong();
        later(1200, () => {
          if (onWrong) onWrong();
        });
      }
    });
  };

  const getButtonClass = (answer) => {
    if (eliminatedAnswers.includes(answer.text)) {
      return "answer eliminated";
    }

    if (phase === "idle") {
      return "answer";
    }

    if (phase === "selected") {
      return answer === selectedAnswer ? "answer active" : "answer";
    }

    if (phase === "revealed") {
      if (answer.correct) {
        return "answer correct";
      }
      if (answer === selectedAnswer && !answer.correct) {
        return "answer wrong";
      }
      return "answer";
    }

    return "answer";
  };

  return (
    <div className="trivia">
      {question?.category && (
        <div className="categoryBadge">
          📌 {question.category}
        </div>
      )}
      <div className="question" role="heading" aria-level={2}>
        {question?.question}
      </div>

      {/* Screen reader live region (BUG-13) */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      <div className="answers">
        {question?.answers?.map((a, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isEliminated = eliminatedAnswers.includes(a.text);

          return (
            <button
              type="button"
              key={a.text}
              disabled={phase !== "idle" || isEliminated}
              className={getButtonClass(a)}
              onClick={() => handleAnswerClick(a)}
              aria-label={`Option ${letter}: ${a.text}`}
              aria-hidden={isEliminated ? "true" : "false"}
            >
              <span className="answerLetter">{letter}:</span>
              <span className="answerText">{a.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Trivia;