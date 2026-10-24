# Millionaire — Business Rules & Decisions Log (Layer 5)

> **Document Type:** Layer 5 Immutable Business Logic & Technical Rules  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Rule Policy:** AI coding assistants MUST NOT modify or violate these rules without explicit user approval.  
> **Last Updated:** 2026-10-24  

---

## 1. Locked Business Rules (Game Economics)

### Rule #001: The 15-Question Fixed Ladder
* **Status:** LOCKED  
* **Specification:** The game MUST consist of exactly 15 questions, numbered sequentially 1 to 15. The grand prize is strictly $1,000,000 upon clearing Question 15.

### Rule #002: Safe Haven Milestone Guarantees
* **Status:** LOCKED  
* **Specification:** 
  1. Once Question 5 is answered correctly, the player's minimum payout drops to no lower than **$1,000**.
  2. Once Question 10 is answered correctly, the player's minimum payout drops to no lower than **$32,000**.
  3. A wrong answer BEFORE Q5 results in strictly **$0**.

### Rule #003: Single Chance Per Question (No Retakes)
* **Status:** LOCKED  
* **Specification:** Once an answer is clicked, it cannot be unselected or switched. The system immediately locks the board.

### Rule #004: The 70/30 KBC Hybrid Question Engine (Option 1: Zero-Cost Public Engine)
* **Status:** LOCKED  
* **Specification:** 
  1. To prevent memorization and ensure infinite replayability, every 15-question run adheres to the **70/30 KBC Hybrid Principle**:
     - **70% (~10 Questions):** Dynamically fetched in real-time from the free public Open Trivia Database (categorized by difficulty: 5 Easy, 3 Medium, 2 Hard).
     - **30% (~5 Questions):** Drawn from the verified local offline question bank (`questions.json`) to preserve foundational trivia familiarity.
  2. **Zero-Cost & Zero-Key Invariant:** Does NOT require paid API plans (Pro accounts), user registration, or API keys.
  3. **Seamless Offline Fallback:** If the network is unavailable or the API times out, the game transparently falls back to 100% local `questions.json` without throwing errors or interrupting gameplay.

---

## 2. Technical Architecture Decisions (ADRs)

### ADR-001: React 19 Client SPA over Server-Rendered Frameworks
* **Date:** 2026-10-24  
* **Decision:** Keep the app as a pure client-side Vite + React 19 application. Do not migrate to Next.js or SSR.  
* **Rationale:** The application is an interactive single-player canvas/browser game with zero SEO or server hydration requirements. Vite provides sub-second HMR and lightweight bundle sizes.

### ADR-002: Modular Web Audio (`use-sound` + Howler)
* **Date:** 2026-10-24  
* **Decision:** Use `use-sound` to interface with the browser's Web Audio API.  
* **Rationale:** Direct DOM `<audio>` tags suffer from high latency, lack cross-fade capabilities, and fail to handle simultaneous sound effects gracefully.

### ADR-003: Zero-Page-Reload State Resets
* **Date:** 2026-10-24  
* **Decision:** Forbid `window.location.reload()` for game resets.  
* **Rationale:** Hard browser reloads cause jarring screen flashes, dump memory caches, and fail to preserve future persistent states (sound settings, sound volume, high score history).

### ADR-004: Pure CSS Architecture over Utility Frameworks
* **Date:** 2026-10-24  
* **Decision:** Keep `App.css` as the single styling source using vanilla CSS, CSS Custom Properties, and keyframe animations. Avoid adding TailwindCSS unless explicitly demanded.

### ADR-005: Local JSON Question Bank for Offline Playability
* **Date:** 2026-10-24  
* **Decision:** Bundle questions locally in `questions.json` rather than requiring remote REST API calls on boot.  
* **Rationale:** Ensures 100% offline availability and zero API latency during intense gameplay.
