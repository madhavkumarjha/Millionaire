# Millionaire — Data Model Specification (Layer 3)

> **Document Type:** Layer 3 Schema & Entity Specification  
> **Target Project:** Millionaire Quiz App (`d:\Millionaire`)  
> **Source Engine:** `src/questions.json` & In-Memory Game Models  
> **Last Updated:** 2026-10-24  

---

## 1. Question Entity Schema

Every trivia entry in `src/questions.json` must strictly conform to the following JSON schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "QuestionEntity",
  "type": "object",
  "required": ["id", "question", "answers"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique 1-based sequential identifier corresponding to ladder rank",
      "minimum": 1,
      "maximum": 15
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard"],
      "description": "V2 classification tier: 1-5 = easy, 6-10 = medium, 11-15 = hard"
    },
    "question": {
      "type": "string",
      "minLength": 5,
      "maxLength": 250,
      "description": "The trivia prompt presented to the user"
    },
    "answers": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": {
        "type": "object",
        "required": ["text", "correct"],
        "properties": {
          "text": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "correct": {
            "type": "boolean"
          }
        }
      }
    }
  }
}
```

### 1.1 Structural Invariants:
1. **Exactly 4 Choices:** Each question MUST provide exactly 4 options ($A, B, C, D$).
2. **Exactly 1 Correct Choice:** The array MUST contain exactly one element with `correct: true` and three with `correct: false`.
3. **No Duplicate Options:** All four `text` values within a single question must be unique.

---

## 2. Prize Pyramid Ladder Model

The 15-tier prize ladder maps sequential question indices to monetary rewards:

| Level (`id`) | Prize String (`amount`) | Raw Value | Status / Safeguard |
| :---: | :--- | :---: | :--- |
| **15** | `$ 1,000,000` | 1,000,000 | 🏆 **Grand Prize (Game Won)** |
| **14** | `$ 500,000` | 500,000 | High Stakes Tier |
| **13** | `$ 250,000` | 250,000 | High Stakes Tier |
| **12** | `$ 125,000` | 125,000 | High Stakes Tier |
| **11** | `$ 64,000` | 64,000 | High Stakes Tier |
| **10** | `$ 32,000` | 32,000 | 🛡️ **Safe Haven Milestone 2** |
| **9** | `$ 16,000` | 16,000 | Intermediate Tier |
| **8** | `$ 8,000` | 8,000 | Intermediate Tier |
| **7** | `$ 4,000` | 4,000 | Intermediate Tier |
| **6** | `$ 2,000` | 2,000 | Intermediate Tier |
| **5** | `$ 1,000` | 1,000 | 🛡️ **Safe Haven Milestone 1** |
| **4** | `$ 500` | 500 | Warmup Tier |
| **3** | `$ 300` | 300 | Warmup Tier |
| **2** | `$ 200` | 200 | Warmup Tier |
| **1** | `$ 100` | 100 | Entry Tier |

---

## 3. Lifeline State Entity (V2 Specification)

```typescript
export interface ILifelineState {
  fiftyFifty: {
    available: boolean;
    used: boolean;
    eliminatedAnswers: string[]; // Stores the 2 incorrect choices to hide
  };
  audiencePoll: {
    available: boolean;
    used: boolean;
    distribution: [number, number, number, number]; // Percentages summing to 100
  };
  flipQuestion: {
    available: boolean;
    used: boolean;
  };
}
```

---

## 4. Question Bank Shuffling & Sampling Algorithm

To avoid repetitive questions across play sessions:
```typescript
/**
 * Picks 15 randomized questions respecting difficulty constraints:
 * 5 Easy (IDs 1-5), 5 Medium (IDs 6-10), 5 Hard (IDs 11-15).
 */
export function sampleGameQuestions(pool: IQuestion[]): IQuestion[] {
  const easy = shuffle(pool.filter(q => q.id <= 5)).slice(0, 5);
  const medium = shuffle(pool.filter(q => q.id > 5 && q.id <= 10)).slice(0, 5);
  const hard = shuffle(pool.filter(q => q.id > 10)).slice(0, 5);
  
  return [...easy, ...medium, ...hard].map((q, idx) => ({
    ...q,
    id: idx + 1 // Re-index sequentially 1 to 15
  }));
}
```
