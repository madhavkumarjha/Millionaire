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
}) => {
  // Phase: "idle" | "selected" | "revealed"
  const [phase, setPhase] = useState("idle");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const [playIntro, { sound: introSound }] = useSound(play);
  const [playCorrect] = useSound(correctSoundFile);
  const [playWrong] = useSound(wrongSoundFile);
  const [playWait, { stop: stopWait }] = useSound(waitSoundFile, {
    loop: true,
    volume: 0.4,
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
    if (!introPlayedRef.current) {
      try {
        playIntro();
      } catch {
        // Autoplay policy
      }
      introPlayedRef.current = true;
    }
  }, [introSound, playIntro]);

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
    // BUG-02: Guard against repeated clicks or clicking during reveal
    if (phase !== "idle") return;

    setPhase("selected");
    setSelectedAnswer(answer);

    // Notify parent that answer is locked (pauses timer)
    if (onAnswerSelect) {
      onAnswerSelect(answer);
    }

    // Play tension wait music during suspense
    try {
      playWait();
    } catch {
      // AudioContext fallback
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
        playCorrect();
        later(1200, () => {
          if (onCorrect) onCorrect();
        });
      } else {
        playWrong();
        later(1200, () => {
          if (onWrong) onWrong();
        });
      }
    });
  };

  const getButtonClass = (answer) => {
    if (phase === "idle") {
      return "answer";
    }

    if (phase === "selected") {
      return answer === selectedAnswer ? "answer active" : "answer";
    }

    if (phase === "revealed") {
      // BUG-07: Always highlight correct in green; clicked wrong in red
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
          return (
            <button
              type="button"
              key={a.text}
              disabled={phase !== "idle"}
              className={getButtonClass(a)}
              onClick={() => handleAnswerClick(a)}
              aria-label={`Option ${letter}: ${a.text}`}
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