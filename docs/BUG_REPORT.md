# Bug Report & Fix Specification (Document 06_BUG_REPORT)

| Field | Value |
|---|---|
| Document | 06_BUG_REPORT |
| Version | V1 |
| Language | English |
| Last Updated | 2026-10-24 |
| Status | All 17 Bugs Resolved (Phase 1, 2, 3) |

## 1. Summary of Resolved Defects

| ID | Sev | Area | File(s) | Title | Status |
|---|---|---|---|---|---|
| **BUG-01** | P0 | Game logic | `App.jsx`, `Trivia.jsx` | No win condition; app crashes after Q16 | ✅ FIXED |
| **BUG-02** | P0 | Game logic | `Trivia.jsx` | Answer can be clicked many times | ✅ FIXED |
| **BUG-03** | P0 | Timer | `Timer.jsx`, `App.jsx` | Timer keeps running while answer is being revealed | ✅ FIXED |
| **BUG-04** | P0 | Game logic | `Trivia.jsx` | Pending timeouts never cleaned up | ✅ FIXED |
| **BUG-05** | P0 | Data | `questions.json` | 4 questions have wrong answer key (Q5, Q6, Q13, Q18) | ✅ FIXED |
| **BUG-06** | P1 | State | `App.jsx` | Restart uses `window.location.reload()` | ✅ FIXED |
| **BUG-07** | P1 | UX | `Trivia.jsx` | Correct answer is never revealed after wrong guess | ✅ FIXED |
| **BUG-08** | P1 | UX | `Start.jsx`, `App.jsx` | Start screen: no Enter-submit, alert(), name unused | ✅ FIXED |
| **BUG-09** | P1 | CSS | `App.css` | Layout is not responsive | ✅ FIXED |
| **BUG-10** | P1 | Code quality | `App.jsx`, `Trivia.jsx` | Derived data stored in state via effects | ✅ FIXED |
| **BUG-11** | P1 | Audio | `Trivia.jsx` | Intro sound silent, `wait.mp3` unused | ✅ FIXED |
| **BUG-12** | P1 | Content | `App.jsx`, `questions.json` | Same 15 questions every game; difficulty does not rise | ✅ FIXED |
| **BUG-13** | P1 | Accessibility | `Trivia.jsx`, `App.css` | Answers are clickable divs | ✅ FIXED |
| **BUG-14** | P2 | CSS | `main.jsx`, `index.css` | No global reset: 16px scrollbar, default font | ✅ FIXED |
| **BUG-15** | P2 | Resilience | `main.jsx`, `ErrorBoundary.jsx` | No error boundary: any error = blank page | ✅ FIXED |
| **BUG-16** | P2 | Data | `questions.json` | Ambiguous / outdated wording (Q2, Q6, Q7) | ✅ FIXED |
| **BUG-17** | P2 | Hygiene | `package.json`, `index.html` | Template leftovers ("new", "Vite + React") | ✅ FIXED |
