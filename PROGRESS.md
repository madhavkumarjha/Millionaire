# Millionaire — Project Progress Tracker

> **Last Updated:** 2026-10-24  
> **Status:** All 17 Bug Report Items (BUG-01 through BUG-17) Fixed & Verified  
> **Production Baseline:** V2 Shipped & Stable  

---

## 📊 Executive Milestone Summary

```
+--------------------------+      +--------------------------+      +--------------------------+
|       V1 BASELINE        | ---> |    V2 BUG SPECIFICATION  | ---> |    V3 ENHANCED ENGINE    |
|   Core Quiz & Pyramid    |      |  17 Bugs Fixed (Ph 1-3)  |      |   Lifelines & Storage    |
|       ✅ 100% DONE       |      |       ✅ 100% DONE       |      |       📅 QUEUED          |
+--------------------------+      +--------------------------+      +--------------------------+
```

---

## 🛠️ Bug Report Fix Status (Document 06_BUG_REPORT)

### Phase 1: P0 Game Logic, Data & State (✅ ALL FIXED)
- [x] **BUG-01 (Game Logic):** Fixed crash after Q16; implemented `TOTAL_QUESTIONS = 15`, `status = "won"` state, derived `earned`, and dedicated Victory Screen.
- [x] **BUG-02 (Game Logic):** Added explicit `phase: "idle" | "selected" | "revealed"`, rendered answers as `<button disabled={phase !== "idle"}>`, guarded against multi-clicking.
- [x] **BUG-03 (Timer):** Rewrote `Timer.jsx` with `paused`, `onTimeUp`, single `setTimeout` chain, and `<Timer key={questionNumber} paused={locked} />`.
- [x] **BUG-04 (Game Logic):** Added `timeoutsRef` to `Trivia.jsx` and cleanup on unmount; eliminated orphan timer callbacks.
- [x] **BUG-05 (Data):** Corrected answer keys for Q5 (dequeue from front), Q6 (min nodes 4), Q13 (insertion sort on few out of place), Q18 (slowest is bubble sort).
- [x] **BUG-10 (Code Quality):** Removed redundant `useEffect` hooks in `App.jsx`; compute `currentQuestion` and `earned` directly in render.

### Phase 2: P1 UX, Audio, Content & Accessibility (✅ ALL FIXED)
- [x] **BUG-06 (State & UX):** Replaced `window.location.reload()` with state reset; keeps player name; centered layout flow.
- [x] **BUG-07 (UX):** In `revealed` phase, correct answer is highlighted green (`answer correct`) and clicked wrong answer is highlighted red (`answer wrong`).
- [x] **BUG-08 (UX / Form):** Replaced `alert()` with inline validation; wrapped in `<form onSubmit>` (Enter key submit); `maxLength={20}`; trimmed name displayed in HUD and end screens.
- [x] **BUG-09 (CSS / Responsiveness):** Added `@media (max-width: 768px)` breakpoints; `min-height: 100dvh`; flex-wrapped money pyramid on mobile; stacked answers.
- [x] **BUG-11 (Audio):** Wired suspense tension audio (`wait.mp3`) during `selected` phase and clean stop on reveal/unmount.
- [x] **BUG-12 (Content & Difficulty):** Implemented `buildQuiz()` picking 5 easy (Tier 1), 5 medium (Tier 2), and 5 hard (Tier 3) questions with Fisher-Yates shuffling.
- [x] **BUG-13 (Accessibility):** Converted answers to `<button type="button">`, added `:focus-visible` styles, `role="timer"` on countdown, `aria-live="polite"` region, and `@media (prefers-reduced-motion)`.

### Phase 3: P2 Hygiene & Resilience (✅ ALL FIXED)
- [x] **BUG-14 (CSS):** Created `src/index.css` with global box-sizing and system font-family reset, imported in `main.jsx`.
- [x] **BUG-15 (Resilience):** Created `src/components/ErrorBoundary.jsx` and wrapped `<App />` in `main.jsx`.
- [x] **BUG-16 (Data):** Clarified ambiguous wording in Q2 (React class component setState), Q6 (3 levels, root is level 1), and Q7 (3 levels, root is level 1).
- [x] **BUG-17 (Hygiene):** Renamed package to `"millionaire-quiz"` in `package.json`, set `<title>Who Wants to Be a Millionaire?</title>` in `index.html`.

---

## 🔮 Future Backlog (V3)
- [ ] 50:50 Lifeline
- [ ] Audience Poll Lifeline
- [ ] Sound Mute / Unmute Toggle Button
- [ ] Persistent LocalStorage Leaderboard
