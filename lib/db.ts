import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Helper to wrap any promise with a timeout.
 * Prevents the application from hanging when Firebase is offline or has invalid credentials.
 */
async function withTimeout<T>(promise: Promise<T>, ms: number = 2000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout of ${ms}ms exceeded`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * Fetches items for a specific workspace key.
 * Prioritizes Firestore if configured, otherwise falls back to localStorage.
 */
export async function getItems<T>(key: string, defaultValue: T[]): Promise<T[]> {
  if (db) {
    try {
      const docRef = doc(db, "workspace_data", key);
      // Wait up to 1.5 seconds for Firestore to reply
      const docSnap = await withTimeout(getDoc(docRef), 1500);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.items)) {
          return data.items as T[];
        }
      }
      // If the doc doesn't exist yet, try to populate it from local storage as a migration step
      if (typeof window !== "undefined") {
        const localSaved = localStorage.getItem(key);
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved) as T[];
            // Proactively save to Firestore to migrate
            await withTimeout(setDoc(docRef, { items: parsed }), 1500);
            console.log(`[DB] Migrated key "${key}" from localStorage to Firestore.`);
            return parsed;
          } catch (e) {}
        }
      }
      return defaultValue;
    } catch (e) {
      console.error(`[DB] Error fetching "${key}" from Firestore:`, e);
      // Fall through to the localStorage fallback below on error/timeout
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T[];
      } catch (e) {
        console.error(`[DB] Error parsing "${key}" from localStorage:`, e);
      }
    }
  }
  return defaultValue;
}

/**
 * Saves items for a specific workspace key.
 * Saves to both Firestore (if configured) and localStorage to keep them in sync.
 */
export async function saveItems<T>(key: string, items: T[]): Promise<void> {
  // Always update localStorage as a backup
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(items));
  }

  if (db) {
    try {
      const docRef = doc(db, "workspace_data", key);
      // Save with a timeout to avoid hanging the UI
      await withTimeout(setDoc(docRef, { items }), 1500);
    } catch (e) {
      console.error(`[DB] Error saving "${key}" to Firestore:`, e);
    }
  }
}

/**
 * Wipes all workspace data from both localStorage and Firestore.
 */
export async function clearAll(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }

  if (db) {
    const keys = [
      "founder_tasks_all",
      "founder_projects",
      "founder_events",
      "founder_clients",
      "founder_expenses",
      "founder_goals",
      "founder_campaigns",
      "founder_transactions",
      "founder_leads"
    ];
    for (const key of keys) {
      try {
        const docRef = doc(db, "workspace_data", key);
        await withTimeout(deleteDoc(docRef), 1500);
      } catch (e) {
        console.error(`[DB] Error deleting document "${key}" from Firestore:`, e);
      }
    }
  }
}
