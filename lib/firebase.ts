import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseAppletConfig from "../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${firebaseAppletConfig.projectId}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${firebaseAppletConfig.projectId}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let db: ReturnType<typeof getFirestore> | null = null;

// Initialize Firebase only if the API key is present
if (firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Use the custom database ID if specified in firebase-applet-config.json
    db = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId || "(default)");
    console.log("[Firebase] Initialized Firestore successfully with Project ID:", firebaseConfig.projectId);
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
} else {
  console.warn(
    "[Firebase] Missing NEXT_PUBLIC_FIREBASE_API_KEY. Falling back to local storage mode."
  );
}

export { db };
