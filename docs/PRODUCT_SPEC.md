# Millionaire — Product Specification (Layer 0)

> **Document Type:** Layer 0 Product Blueprint  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Version Scope:** V1 Shipped | V2 Active Target | V3 Future Scope  
> **Last Updated:** 2026-10-24  

---

## 1. Executive Summary & Vision

The **Millionaire Quiz App** is a high-tension, TV game-show inspired ("Who Wants to Be a Millionaire?" / "Kaun Banega Crorepati") interactive single-page web game built with React 19 and Vite.

The core objective is to deliver the authentic, nail-biting studio atmosphere to the browser: 15 escalating difficulty trivia questions, dynamic ticking clocks, authentic sound effects, cash milestone safe havens, and a final $1,000,000 grand prize.

---

## 2. Core Game Loop

```
[Start Screen: Username Entry]
            │
            ▼
[Question Loaded (1 to 15)] ──► [30s Countdown Clock Starts]
            │                              │
            ▼                              ▼
[Player Selects Answer]          [Time Runs Out (0s)]
            │                              │
    ┌───────┴───────┐                      ▼
    ▼               ▼             [GAME OVER: Timeout]
[Correct]       [Incorrect]                │
    │               │                      ▼
    ├─► Q15: [VICTORY: $1,000,000]   [Drop to Safe Milestone]
    │                                      │
    └─► Q < 15: [Advance Ladder & Next Q]  ▼
                                      [Restart / Retry]
```

---

## 3. Product Feature Matrix & Phasing

| Feature Module | V1 (Shipped / Current) | V2 (Active Target) | V3 (Future Scope) |
| :--- | :--- | :--- | :--- |
| **Question Engine** | 15 Static Questions (`questions.json`) | **70/30 KBC Dynamic Hybrid Engine** (Option 1: 10 Fresh Public Questions + 5 Local Classics; Zero-Cost / Zero-Key) | Custom AI Prompting & Category Selectors |
| **Timer System** | 30s countdown per question | Pause on answer lock & urgent SFX | Custom timer limits & sudden death mode |
| **Audio & SFX** | Play, Correct, Wrong sound effects | Tension wait loop (`wait.mp3`), mute/unmute toggle | Voiceover host narration & volume slider |
| **Scoreboard & Ladder** | 15-tier visual money pyramid | Guaranteed Safe Havens ($1K, $32K drop-down calculation) | Persistent High Scores & Leaderboard |
| **Lifelines** | None | 50:50, Audience Poll, Flip Question | Ask the Expert / AI Lifeline |
| **Game Over & Victory** | Browser reload restart | Dedicated Victory / Loss celebration modals | Share certificate & social brag graphics |

---

## 4. Victory & Safe Haven Payout Rules

1. **Safe Haven Milestones:**
   - **Question 5 (Milestone 1):** $\$1,000$ guaranteed payout once passed.
   - **Question 10 (Milestone 2):** $\$32,000$ guaranteed payout once passed.
   - **Question 15 (Grand Prize):** $\$1,000,000$ victory.
2. **Incorrect Answer Fallback:**
   - If player fails before Q5: Walks away with $\$0$.
   - If player fails between Q6 and Q9: Drops back to guaranteed $\$1,000$.
   - If player fails between Q11 and Q14: Drops back to guaranteed $\$32,000$.
3. **Walk Away Option (V2):**
   - Player can voluntarily quit before answering to lock in their current tier money.

---

## 5. Non-Functional Requirements (NFRs)

- **First Contentful Paint (FCP):** $< 800\text{ms}$ on standard broadband.
- **Responsiveness:** Fluid scaling across Desktop ($1920\times1080$), Tablet ($768\times1024$), and Mobile ($375\times812$).
- **Zero Audio Lag:** Web Audio dispatch within $< 50\text{ms}$ of user click.
- **Offline Capable:** Zero external cloud dependencies for basic offline gameplay.
