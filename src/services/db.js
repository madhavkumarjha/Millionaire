// Native IndexedDB Service for Millionaire Quiz App
// Zero-cost, zero-tokens, 100% offline-ready

const DB_NAME = "MillionaireDB";
const DB_VERSION = 1;

let dbInstance = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store 1: Game History (Scores, Run Stats)
      if (!db.objectStoreNames.contains("game_history")) {
        const historyStore = db.createObjectStore("game_history", {
          keyPath: "id",
          autoIncrement: true,
        });
        historyStore.createIndex("date", "date", { unique: false });
      }

      // Store 2: Questions Cache (Local + Dynamic Questions)
      if (!db.objectStoreNames.contains("questions_cache")) {
        db.createObjectStore("questions_cache", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error("IndexedDB initialization error:", event.target.error);
      reject(event.target.error);
    };
  });
};

// Save a completed game run (Won or Lost)
export const saveGameSession = async ({ username, earned, questionNumber, status }) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["game_history"], "readwrite");
      const store = transaction.objectStore("game_history");

      const session = {
        username: username || "Player",
        earned,
        questionReached: questionNumber,
        status, // "won" | "lost"
        timestamp: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const request = store.add(session);
      request.onsuccess = () => resolve(session);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("Failed to save game session to IndexedDB:", err);
    return null;
  }
};

// Retrieve all historical game runs
export const getGameHistory = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["game_history"], "readonly");
      const store = transaction.objectStore("game_history");
      const request = store.getAll();

      request.onsuccess = () => {
        const history = request.result || [];
        // Sort newest first
        resolve(history.reverse());
      };
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("Failed to read history from IndexedDB:", err);
    return [];
  }
};

// Cache dynamically fetched questions into IndexedDB
export const cacheQuestions = async (questions) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(["questions_cache"], "readwrite");
    const store = transaction.objectStore("questions_cache");

    questions.forEach((q) => {
      if (q && q.id) {
        store.put(q);
      }
    });
  } catch (err) {
    console.warn("Failed to cache questions in IndexedDB:", err);
  }
};
