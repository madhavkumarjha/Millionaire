# Millionaire — Product Requirements Document (PRD)

> **Document Version:** 2.0  
> **Status:** Active Baseline  
> **Production Baseline:** V1 Shipped & Functional  
> **Active Target:** V2 (Stability, Polish & Safe Havens)  
> **Last Updated:** 2026-10-24  

---

## 1. Product Overview

### 1.1 Vision
The **Millionaire Quiz App** brings the high-stakes, suspenseful studio atmosphere of the iconic "Who Wants to Be a Millionaire?" / "Kaun Banega Crorepati" game show directly into modern web browsers. Built on React 19 and Vite, it delivers instant response times, synchronized television sound effects, milestone cash prize drop-downs, and a 15-question ladder to the $1,000,000 jackpot.

### 1.2 Core Value Proposition
- **For Players:** Thrilling, tension-filled gameplay with ticking clocks, heart-pounding audio, and safe haven checkpoints that guarantee cash floors at Question 5 ($1,000) and Question 10 ($32,000).
- **For Developers:** Clean, decoupled React 19 architecture, modular audio dispatching, and zero-dependency vanilla CSS design system.

---

## 2. Target Personas & User Journeys

| Persona | Goals | Pain Points Solved | Key Journey |
| :--- | :--- | :--- | :--- |
| **Casual Quizzer** | Quick, engaging trivia session during breaks with authentic game show tension. | Eliminates dry, static quiz forms; introduces real TV suspense with audio and ticking clock. | Enter Name ➔ Question 1 ➔ Hear intro sound ➔ Answer within 30s ➔ Win money. |
| **High Stakes Competitor** | Reach the $1,000,000 grand prize; test knowledge across escalating difficulties. | Clear progress ladder; safe haven milestones prevent total wipeout. | Strategize answers ➔ Pass Q5 ($1K) ➔ Pass Q10 ($32K) ➔ Win $1,000,000 celebration. |

---

## 3. Product Feature Matrix & Version Scope

| Feature Module | V1 (Baseline Shipped) | V2 (Active Target) | V3 (Future Scope) |
| :--- | :--- | :--- | :--- |
| **Question Engine** | 15 Static Questions | **70/30 KBC Dynamic Hybrid Engine** (Option 1: 10 Fresh Public Questions + 5 Local Classics; Zero-Cost / Zero-Key) | Custom AI Prompting & Category Selectors |
| **Countdown Timer** | 30s continuous timer | Dynamic pause during answer evaluation | Sudden death & custom time limits |
| **Audio Subsystem** | Basic sound effects | `wait.mp3` tension loop + Mute toggle | Host commentary & audio mixer |
| **Prize Ladder** | 15-tier visual pyramid | Safe haven payout calculation ($1K, $32K) | High-score leaderboard in LocalStorage |
| **Victory & Restart** | Full page reload on loss | Dedicated Victory Screen + Smooth React Reset | Confetti particle FX & Share card |
| **Lifelines** | None | 50:50 Lifeline (Bonus) | Audience Poll & Flip Question |

---

## 4. Victory & Safe Haven Payout Rules

1. **Safe Haven Milestones:**
   - **Question 5 (Milestone 1):** $\$1,000$ minimum guaranteed take-home.
   - **Question 10 (Milestone 2):** $\$32,000$ minimum guaranteed take-home.
   - **Question 15 (Grand Prize):** $\$1,000,000$ jackpot.
2. **Loss Deduction Formula:**
   $$\text{Payout}(N) = \begin{cases} 
   \$1,000,000 & \text{if } N = 15 \text{ (Victory)} \\
   \$32,000 & \text{if } 10 \le N < 15 \\
   \$1,000 & \text{if } 5 \le N < 10 \\
   \$0 & \text{if } N < 5 
   \end{cases}$$
