# AGENT.md — Master AI Rulebook for Millionaire Quiz App

> **This is the primary directive document for all AI agents (Antigravity, Claude, Cursor, GPT) contributing to Millionaire.**  
> Every AI agent working on this codebase MUST read and strictly enforce the rules set forth in this document before writing code or modifying architectural files.

---

## 1. Project Philosophy & Core Directives

1. **Documentation-First Development:**
   - No feature or architectural change may be introduced without consulting the 8-Layer Documentation suite (`docs/`).
   - Technical rules and immutable decisions logged in `docs/DECISIONS.md` MUST NOT be overridden without explicit user approval.
   - All progression and completed backlog tasks must be synced with `PROGRESS.md` and `docs/MASTER_ROADMAP.md`.

2. **Zero-Reload State Continuity:**
   - Never use `window.location.reload()` for game resets or retries. All resets must be executed cleanly via React state mutation.

3. **Audio Autoplay & Web Audio Strictness:**
   - Never trigger Web Audio playback prior to an explicit user interaction (click on the Start Screen).
   - Ensure audio buffers are properly disposed on component unmount to prevent audio memory leaks.

4. **Deterministic Game Loop & Concurrency Protection:**
   - Single click per question invariant: Immediately lock choices upon initial click to avoid double-firing or audio overlap.
   - Synchronize timers: The countdown timer must pause during the answer evaluation delay and audio playback.
   - Question 15 boundary: Trigger a dedicated Victory state; never attempt to load non-existent Question 16 (`data[15]`).

---

## 2. Technical Stack Boundaries

- **Core Framework:** React 19 + Vite 7
- **Styling:** Pure Vanilla CSS with CSS custom variables and hardware-accelerated keyframe animations in `App.css`. Avoid TailwindCSS unless explicitly instructed.
- **Audio Engine:** `use-sound` (built over Howler.js)
- **Data Source:** Offline static JSON bank in `src/questions.json`

---

## 3. Permitted vs. Forbidden Actions

### ✅ Permitted:
- Fixing timer pause/resume synchronization during answer evaluation.
- Adding dedicated Victory modal when Question 15 is cleared.
- Refactoring `App.css` for responsive mobile viewports.
- Integrating `src/sounds/wait.mp3` background tension loop.
- Implementing lifelines (50:50, Audience Poll) per `docs/DATA_MODEL.md`.

### ❌ Strictly Forbidden:
- Installing heavy runtime CSS frameworks without explicit user request.
- Altering the question schema keys without updating `docs/DATA_MODEL.md`.
- Leaving open intervals or memory leaks in `setInterval` or audio handlers.
- Using full page reloads to reset game state.

---

## 4. Verification Protocol After Every Code Modification

Before notifying the user that a task is complete, the agent MUST execute:

1. **Build Verification:**
   ```powershell
   npm.cmd run build
   ```
   Must exit with code 0 (zero compilation or module errors).

2. **Lint Validation:**
   ```powershell
   npm.cmd run lint
   ```
   Must pass all ESLint rules without breaking.

3. **Status Sync:**
   Update `PROGRESS.md` and `docs/MASTER_ROADMAP.md` to reflect newly completed items.
