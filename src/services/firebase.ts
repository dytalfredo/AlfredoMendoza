import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('DUMMY');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize Firebase if properly configured
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

// Export with fallback warning
export { auth, db };

// Helper to check if Firebase is available
export const isFirebaseAvailable = () => {
  return auth !== null && db !== null;
};

// Log warning if Firebase is not configured (only in development)
if (import.meta.env.DEV && !isFirebaseConfigured) {
  console.warn(
    '⚠️ Firebase is not configured. Add Firebase credentials to .env.local:\n' +
    'PUBLIC_FIREBASE_API_KEY=your-api-key\n' +
    'PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain\n' +
    'PUBLIC_FIREBASE_PROJECT_ID=your-project-id\n' +
    'PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket\n' +
    'PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id\n' +
    'PUBLIC_FIREBASE_APP_ID=your-app-id'
  );
}