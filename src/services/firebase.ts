import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: In a real deployment, these come from import.meta.env or process.env
// We provide fallback values to prevent the app from crashing immediately if env vars are missing.
// Auth operations will still fail if the keys are invalid, but the UI will render.
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "AIzaSy_DUMMY_KEY_FOR_RENDERING",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "00000000000",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:00000000000:web:00000000000"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);