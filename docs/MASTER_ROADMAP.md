# Millionaire — Master Roadmap (Layer 4)

> **Document Type:** Layer 4 Unified Backlog & Single Source of Truth  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Replaces:** Unstructured README feature checklists  
> **Last Updated:** 2026-10-24  

---

## 1. Version Overview & Phase Horizons

```
[V1 MVP: Foundation] ────► [V2 Active: Stability & Polish] ────► [V3 Target: Lifelines & Rich UX]
    (Shipped)                      (Current Sprint)                       (Backlog)
- Core Question Engine         - Multi-click answer lock              - 3 Classical Lifelines
- 30s Countdown Timer          - Timer pause during evaluation        - Audience poll chart
- Money Pyramid UI             - Q15 Victory modal & confetti         - Safe haven bank drop
- Basic sound effects          - Non-reload smooth restart            - Sound mute toggle
                               - Background tension loop (wait.mp3)   - Mobile layout drawer
```

---

## 2. V1: Shipped & Verified Core Features

- [x] **React 19 + Vite Setup:** Zero-config ESM build pipeline.
- [x] **Indexed Question Bank:** Local `questions.json` containing technical trivia.
- [x] **Money Pyramid Ladder:** 15-tier visual hierarchy with active rank highlighting.
- [x] **Basic Web Audio Integration:** `play.mp3`, `correct.mp3`, `wrong.mp3` loaded via `use-sound`.
- [x] **Countdown Clock:** Basic 30-second interval ticking in `Timer.jsx`.
- [x] **Start Gateway:** Onboarding name input with session gatekeeper in `Start.jsx`.

---

## 3. V2: Active Target (P0 Bugs & Stability Fixes) (✅ COMPLETED)

### Critical P0 Gameplay Fixes
- [x] **Multi-Click Answer Lockdown:** Disable pointer events and guard `handleClick` once an option has been chosen (`Trivia.jsx`).
- [x] **Timer Pause Synchronization:** Pause the countdown timer immediately when an option is selected so it doesn't expire during the 3-5s evaluation audio (`Timer.jsx`).
- [x] **Terminal Victory Condition:** When Question 15 is answered correctly, trigger a dedicated Victory screen with $1,000,000 celebration instead of attempting to load Q16 (`App.jsx`).
- [x] **State-Driven Restart Handler:** Replace disruptive `window.location.reload()` with programmatic React state resets (`App.jsx`).
- [x] **Safe Haven Drop Calculation:** Ensure that losing drops the player's winnings down to the reached milestone ($1,000 or $32,000) instead of giving them the previous question's amount.

### P1 Audio & Visual Enhancements
- [x] **Integrate `wait.mp3` Tension Loop:** Play the iconic 2.7MB background waiting music while a question is active.
- [ ] **Audio Mute/Unmute Toggle:** Add header control to mute/unmute game sounds.
- [x] **Mobile Responsive Layout:** Ensure the timer and pyramid collapse gracefully on small screens (`App.css`).

---

## 4. V3: Advanced Features & Lifelines

- [ ] **50:50 Lifeline:** Randomly eliminate 2 incorrect choices from the current question.
- [ ] **Audience Poll Lifeline:** Generate realistic skewed percentages weighted towards the correct answer.
- [ ] **Flip The Question:** Swap out the active question with a fresh backup question from the same difficulty tier.
- [ ] **Persistent High Scores:** Track top 5 local high scores and fastest completion times in `localStorage`.
- [ ] **Sound Volume Slider:** Fine-grained audio mix control.
