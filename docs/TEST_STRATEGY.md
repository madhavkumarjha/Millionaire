# Millionaire — Testing Strategy & QA Specification (Layer 6)

> **Document Type:** Layer 6 Automated Testing & Quality Assurance Blueprint  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Test Framework:** Vitest + React Testing Library (Target) / Manual QA Matrix  
> **Last Updated:** 2026-10-24  

---

## 1. Testing Philosophy & Quality Gateways

The testing strategy ensures deterministic gameplay, zero race conditions in audio/animation timers, and accurate prize payouts.

```
       / \
      / E2E \       Playwright / Browser Smoke Tests (Complete 15-Question Run)
     /-------\
    /  Integ  \     React Testing Library (Answer Selection -> Lock -> SFX -> Ladder Step)
   /-----------\
  /    Unit     \   Vitest (Timer Countdown, Payout Math, Question Shuffler)
 /---------------\
```

---

## 2. Test Suites & Test Matrix

### 2.1 Unit Tests (`src/__tests__/`)

| Test Suite | Target Module | Test Case Description | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **`timer.test.js`** | `Timer.jsx` | 1. Ticks downward by 1 every 1000ms.<br>2. Clears interval on unmount.<br>3. Fires `setStop(true)` when timer reaches 0.<br>4. Resets to 30s when `questionNumber` prop changes. | Interval does not leak; callback fires at exactly $t=0$. |
| **`payout.test.js`** | `App.jsx` Helper | 1. Return $0 if lost at Q1..Q4.<br>2. Return $1,000 if lost at Q6..Q9.<br>3. Return $32,000 if lost at Q11..Q14.<br>4. Return $1,000,000 if Q15 cleared. | Payout matches mathematical Safe Haven formula. |
| **`schema.test.js`** | `questions.json` | 1. Validates all 15 questions have exactly 4 choices.<br>2. Exactly one option has `correct: true`.<br>3. No empty strings or duplicate option texts. | 100% schema compliance. |

### 2.2 Integration Tests

| Target Component | User Interaction Flow | Expected System Reaction |
| :--- | :--- | :--- |
| **`Trivia.jsx`** | User clicks Option B | 1. Selected option receives `.active` class.<br>2. Subsequent clicks on Option A, C, D are ignored.<br>3. After 3000ms delay, option turns `.correct` (green) or `.wrong` (crimson).<br>4. Correct audio sound trigger fires. |
| **`Start.jsx`** | User submits empty string | Input rejected, alert/error shown, `setUsername` NOT called. |
| **`App.jsx`** | Question 15 answered correctly | `isVictory` state toggles true, Victory Screen renders with $1,000,000 banner, no error on `data[15]`. |

---

## 3. Critical Edge Cases & Manual QA Checklist

- [ ] **Fast Double-Clicking:** Click an answer twice rapidly. Verify only one click is registered and no duplicate timers or sound overlaps trigger.
- [ ] **Last-Second Click:** Click an answer when the timer is at `1s`. Verify the timer pauses and the answer evaluation completes without an unexpected timeout game-over.
- [ ] **Tab Switching / Background Throttling:** Switch browser tab while timer is running. Verify `setInterval` timing remains synchronized upon tab return.
- [ ] **Audio Mute Consistency:** When muted, no sound effects or background music play, but visual keyframes and timers proceed normally.
- [ ] **Non-Reload Restart:** Click restart on Game Over. Verify user is returned to Question 1 with reset money ($0) and clean timer without full page reload.
