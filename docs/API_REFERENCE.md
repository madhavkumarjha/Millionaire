# Millionaire — API Reference Guide (Layer 2)

> **Document Type:** Layer 2 Authoritative API & Component Contract  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Base Target:** Client-Side Component Interface & Future Leaderboard Endpoint  
> **Last Updated:** 2026-10-24  

---

## 1. Component Interfaces & Props Contracts

### 1.1 `Start` Component (`<Start />`)
Responsible for initial user authentication and session gatekeeping.

```typescript
interface StartProps {
  /** Callback fired when user submits a valid non-empty username */
  setUsername: (name: string) => void;
}
```

### 1.2 `Timer` Component (`<Timer />`)
Interval counter ticking once every 1000ms from 30 down to 0.

```typescript
interface TimerProps {
  /** Setter to terminate game on timeout expiration */
  setStop: (stop: boolean) => void;
  /** Current question index; resetting this resets timer to 30 */
  questionNumber: number;
  /** Optional V2 flag: Pause timer during answer evaluation */
  isPaused?: boolean;
}
```

### 1.3 `Trivia` Component (`<Trivia />`)
The core gameplay engine evaluating choices and driving audio.

```typescript
interface TriviaProps {
  /** Complete dataset array of questions */
  data: IQuestion[];
  /** Signal game termination on wrong answer */
  setStop: (stop: boolean) => void;
  /** Active 1-indexed question pointer (1 through 15) */
  questionNumber: number;
  /** Increments the active question pointer */
  setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
  /** V2: Triggers pause/resume on timer during answer lock */
  setIsTimerPaused?: (paused: boolean) => void;
  /** V2: Active lifelines remaining */
  lifelines?: ILifelineState;
}
```

---

## 2. Client-Side State Contracts

### 2.1 Game Session State (`App.jsx`)
```typescript
interface IGameState {
  /** Authenticated player display name */
  username: string | null;
  /** 1-based index of active question (1..15) */
  questionNumber: number;
  /** Cached array of question entities */
  data: IQuestion[];
  /** Formatted string of accumulated money (e.g., "$ 32,000") */
  earned: string;
  /** Terminal flag indicating whether current run has finished */
  stop: boolean;
  /** V2: Terminal victory flag when clearing question 15 */
  isVictory: boolean;
  /** V2: Master audio mute toggle */
  isMuted: boolean;
}
```

### 2.2 Money Pyramid Ladder Item
```typescript
interface IMoneyTier {
  id: number;          // 1 to 15
  amount: string;      // Display string e.g. "$ 1,000,000"
  numericValue: number;// Raw number for calculations
  isMilestone: boolean;// true for Q5 ($1K) and Q10 ($32K)
}
```

---

## 3. Storage Contracts (`localStorage`)

V2 High Scores & Settings are serialized in the client browser:

```typescript
/** Key: "millionaire_high_score" */
interface IStoredScore {
  username: string;
  amountEarned: string;
  numericEarned: number;
  questionsCleared: number;
  timestamp: string; // ISO 8601
}

/** Key: "millionaire_settings" */
interface IStoredSettings {
  soundEnabled: boolean;
  volume: number; // 0.0 to 1.0
}
```

---

## 4. Future V3 Server REST API Spec (Optional Leaderboard)

When integrating a cloud leaderboard backend (e.g. Express / Supabase):

```http
POST /api/v1/scores
Content-Type: application/json

{
  "username": "PlayerOne",
  "score": 1000000,
  "questionsAnswered": 15,
  "timeTakenSeconds": 184
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "rank": 3,
  "leaderboard": [
    { "rank": 1, "username": "Alpha", "score": 1000000 },
    { "rank": 2, "username": "Beta", "score": 1000000 },
    { "rank": 3, "username": "PlayerOne", "score": 1000000 }
  ]
}
```
