# Millionaire — System Architecture (Layer 1)

> **Document Type:** Layer 1 Architecture Specification  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Source:** Extracted from core implementation & React 19 architecture standards  
> **Last Updated:** 2026-10-24  

---

## 1. High-Level System Architecture

The application is engineered as a **Pure Decoupled Client-Side SPA (Single Page Application)** using Vite 7 and React 19. All game state, question evaluation, timing intervals, and sound synthesis happen in the browser runtime.

```
+-------------------------------------------------------------------------+
|                             BROWSER RUNTIME                             |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                            App.jsx                                |  |
|  |         (Master Game Orchestrator & Global State Hub)             |  |
|  +-------------------+---------------------------+-------------------+  |
|                      |                           |                      |
|         +------------v------------+              |                      |
|         |    Active Session HUD   |              |                      |
|         +------------+------------+              |                      |
|                      |                           |                      |
|        +-------------+-------------+             |                      |
|        |                           |             v                      |
|  +-----v-------+           +-------v----+   +----+-------------------+  |
|  |  Timer.jsx  |           | Trivia.jsx |   |    Pyramid Board       |  |
|  |  (Interval) |           |  (Engine)  |   | (15-Tier Cash Ladder)  |  |
|  +-------------+           +-------+----+   +------------------------+  |
|                                    |                                    |
|                      +-------------+-------------+                      |
|                      |                           |                      |
|                      v                           v                      |
|         +------------+------------+ +------------+------------+         |
|         | questions.json Bank     | | Sound Controller Engine |         |
|         | (Static Local Schema)   | | (Web Audio / use-sound) |         |
|         +-------------------------+ +-------------------------+         |
+-------------------------------------------------------------------------+
```

---

## 2. Component Hierarchy & Module Boundaries

```
src/
├── main.jsx                     # React 19 createRoot DOM mounter
├── App.jsx                      # Central State Coordinator & Screen Router
│   ├── components/Start.jsx     # Onboarding & Username capture
│   ├── components/Timer.jsx     # Discrete countdown clock (30s tick cycle)
│   ├── components/Trivia.jsx    # Question presentation & option evaluator
│   └── Pyramid Component        # Progression rank sidebar (1 to 15)
├── sounds/                      # Web Audio assets (play, correct, wrong, wait)
├── questions.json               # Schema-validated trivia dataset
└── App.css                      # Design system, glassmorphism & keyframes
```

### Component Responsibility Contract:

| Component | Hierarchy Level | Primary Duty | Boundary Constraints |
| :--- | :--- | :--- | :--- |
| **`App.jsx`** | Root (Level 0) | Maintains session state, tracks active question index, controls game-over and victory conditions. | Must NOT directly mutate audio or DOM intervals. |
| **`Start.jsx`** | Gateway (Level 1) | Gathers player name, fulfills browser Autoplay user-interaction prerequisite. | Unmounts completely once session begins. |
| **`Timer.jsx`** | Utility (Level 1) | Runs 30s countdown; notifies `App` on expiration (`setStop(true)`). | Must cleanly unmount interval on question step or lock. |
| **`Trivia.jsx`** | Gameplay (Level 1) | Handles option rendering, lockdown state, answer verification delays, and SFX dispatch. | Communicates status outward only via props callbacks. |

---

## 3. UI/UX Layout Architecture

The viewport uses a responsive Flexbox/Grid composite structure:
- **Game Stage (`.main`):** Takes 75% desktop width. Holds the status HUD/Timer (`.top`) and active question/choice box (`.bottom`).
- **Money Pyramid (`.pyramid`):** Takes 25% desktop width. Inverted 15-tier visual hierarchy highlighting the current active rank in real time.
- **Mobile Viewport Breakpoint (`<= 768px`):** Stacks the Pyramid below the game stage or turns it into a collapsible drawer.

---

## 4. Audio Architecture & Autoplay Policy Compliance

Modern browsers (Chrome, Safari, Edge) block the Web Audio `AudioContext` until a formal user interaction occurs.
1. The **Start Screen (`Start.jsx`)** requires an explicit button click.
2. The click handler triggers the initial audio playback (`letsPlay()`), instantly unlocking the browser `AudioContext` for all subsequent game effects (`correctAnswer()`, `wrongAnswer()`, `waitLoop()`).

---

## 5. Dynamic Question Pipeline (70/30 KBC Hybrid Engine)

To prevent question memorization across sessions while ensuring 100% offline availability and zero subscription costs (Option 1):

```
       [Game Init / Start Clicked]
                   │
                   ▼
       [Question Builder Service]
       ┌───────────┴───────────┐
       ▼ (70% ~ 10 Qs)         ▼ (30% ~ 5 Qs)
[Open Trivia Public Engine] [Local questions.json Bank]
 (Easy/Med/Hard Endpoints)   (Tier-matched classical trivia)
       │                       │
       └───────────┬───────────┘
                   │
                   ▼
     [Assemble 15-Question Ladder]
     (Q1-5: Easy | Q6-10: Med | Q11-15: Hard)
                   │
                   ▼
         [Active Game Session]
```

* **Network Fallback Policy:** If public endpoint response takes > 2500ms or fails, the engine seamlessly supplies 100% of questions from the local pool without throwing errors.

