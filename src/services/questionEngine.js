import localQuestions from "../questions.json";
import { cacheQuestions } from "./db";

// Helper to decode HTML entities returned by trivia endpoints (&quot;, &#039;, &amp;)
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Fisher-Yates array shuffler
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetch dynamic questions from free public Open Trivia DB (Zero-Token, Zero-Cost)
async function fetchPublicQuestions(amount, difficulty) {
  const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout for zero lag

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return [];
    const data = await response.json();

    if (!data.results || data.results.length === 0) return [];

    const difficultyNum = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

    return data.results.map((item, idx) => {
      const formattedAnswers = [
        { text: decodeHtml(item.correct_answer), correct: true },
        ...item.incorrect_answers.map((inc) => ({
          text: decodeHtml(inc),
          correct: false,
        })),
      ];

      return {
        id: `dyn_${difficulty}_${Date.now()}_${idx}`,
        difficulty: difficultyNum,
        category: decodeHtml(item.category),
        question: decodeHtml(item.question),
        answers: shuffleArray(formattedAnswers),
      };
    });
  } catch {
    clearTimeout(timeoutId);
    return []; // Return empty on timeout or offline to trigger local fallback
  }
}

/**
 * 70/30 KBC Hybrid Question Builder:
 * Combines 10 dynamically fetched fresh questions with 5 classical local questions.
 * Fallback: Uses 15 local questions if offline.
 */
export async function buildHybridQuiz() {
  // Pre-filter local questions by difficulty
  const localEasy = shuffleArray(localQuestions.filter((q) => q.difficulty === 1));
  const localMedium = shuffleArray(localQuestions.filter((q) => q.difficulty === 2));
  const localHard = shuffleArray(localQuestions.filter((q) => q.difficulty === 3));

  try {
    // Attempt parallel fetch: 5 Easy, 3 Medium, 2 Hard
    const [dynEasy, dynMedium, dynHard] = await Promise.all([
      fetchPublicQuestions(4, "easy"),
      fetchPublicQuestions(3, "medium"),
      fetchPublicQuestions(3, "hard"),
    ]);

    // Cache any successfully fetched questions into IndexedDB
    const allFetched = [...dynEasy, ...dynMedium, ...dynHard];
    if (allFetched.length > 0) {
      cacheQuestions(allFetched);
    }

    // Assemble Tier 1 (Q1 to Q5 - Easy): blend dynamic + local
    const tier1 = [
      ...dynEasy,
      ...localEasy.slice(0, 5 - dynEasy.length),
    ].slice(0, 5);

    // Assemble Tier 2 (Q6 to Q10 - Medium): blend dynamic + local
    const tier2 = [
      ...dynMedium,
      ...localMedium.slice(0, 5 - dynMedium.length),
    ].slice(0, 5);

    // Assemble Tier 3 (Q11 to Q15 - Hard): blend dynamic + local
    const tier3 = [
      ...dynHard,
      ...localHard.slice(0, 5 - dynHard.length),
    ].slice(0, 5);

    const finalQuiz = [...tier1, ...tier2, ...tier3].map((q, idx) => ({
      ...q,
      gameIndex: idx + 1,
    }));

    return finalQuiz;
  } catch (err) {
    console.warn("Dynamic fetch failed, falling back to 100% local question bank:", err);
    // Instant seamless offline fallback
    const fallbackQuiz = [
      ...localEasy.slice(0, 5),
      ...localMedium.slice(0, 5),
      ...localHard.slice(0, 5),
    ].map((q, idx) => ({
      ...q,
      gameIndex: idx + 1,
    }));

    return fallbackQuiz;
  }
}
