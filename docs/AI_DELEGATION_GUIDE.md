# Millionaire — AI Delegation Guide (Layer 7)

> **Document Type:** Layer 7 AI Standard Operating Procedure (SOP)  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Applies To:** Antigravity AI, Claude, ChatGPT, Cursor, and any Agentic Coding System  
> **Last Updated:** 2026-10-24  

---

## 1. Prime Directives for AI Assistants

When modifying, enhancing, or debugging code in this repository, all AI agents MUST adhere to these non-negotiable directives:

1. **Follow the 8-Layer Documentation Suite:**
   Always consult `docs/DECISIONS.md` before altering business logic. Check `docs/MASTER_ROADMAP.md` before adding new features.
2. **Never Break Audio Autoplay Protocol:**
   Never trigger `AudioContext` play calls before an explicit user click has occurred (handled in `Start.jsx`).
3. **No Page-Reload Hacks:**
   Never write `window.location.reload()` for game resets. Use programmatic React state updates.
4. **Never Alter Question Invariants:**
   Every trivia question in `questions.json` MUST have exactly 4 choices and exactly 1 `correct: true`.
5. **Always Prevent Multi-Click Race Conditions:**
   Whenever modifying click handlers in `Trivia.jsx`, ensure answer locks are immediate (`if (selectAnswer) return;`).

---

## 2. Permitted vs Forbidden Actions

### ✅ Permitted AI Tasks:
- Fixing timer pause/resume synchronization during answer evaluation.
- Adding the victory modal / celebration screen when Question 15 is cleared.
- Refactoring `App.css` for responsive mobile viewports.
- Integrating `src/sounds/wait.mp3` background tension loop.
- Implementing lifelines (50:50, Audience Poll) according to `docs/DATA_MODEL.md`.
- Writing Vitest unit/integration tests following `docs/TEST_STRATEGY.md`.

### ❌ Strictly Forbidden Actions:
- Installing heavy CSS frameworks (TailwindCSS, Bootstrap) unless explicitly commanded by user.
- Switching React 19 to Next.js or SSR.
- Mutating original question schema keys without updating `docs/DATA_MODEL.md`.
- Deleting or overwriting the 8-layer docs without user consent.
- Leaving unhandled memory leaks in `setInterval` or audio buffer instances.

---

## 3. Verification Protocol After Every Code Change

Before marking any task complete, the AI assistant MUST run and verify:

1. **Build Validation:**
   ```powershell
   npm.cmd run build
   ```
   Must compile cleanly with zero errors.

2. **Lint Validation:**
   ```powershell
   npm.cmd run lint
   ```
   Must pass all ESLint rules without breaking.

3. **Manual Flow Check:**
   - Verify Start screen ➔ Question 1 transition.
   - Verify Timer counts down.
   - Verify selecting an option locks secondary clicks.
   - Verify correct/wrong sounds play appropriately.
