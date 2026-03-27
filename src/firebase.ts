import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocFromServer, doc } from 'firebase/firestore';

// Initialize Firebase with environment variables or local JSON config
// This allows the project to be public without exposing secrets in the JSON file
let firebaseConfig: any;
let firestoreDatabaseId: string | undefined;

// Prioritize environment variables (VITE_ prefix is required for client-side access in Vite)
if (import.meta.env.VITE_FIREBASE_API_KEY) {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
  firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;
} else {
  // Fallback to local JSON config if environment variables are not set
  try {
    // We use a dynamic import here so the build doesn't break if the file is missing in a public repo
    // @ts-ignore
    const config = await import('../firebase-applet-config.json');
    firebaseConfig = config.default;
    firestoreDatabaseId = config.default.firestoreDatabaseId;
  } catch (error) {
    console.warn("Firebase configuration not found in environment variables or firebase-applet-config.json");
    // Provide a dummy config to prevent the app from crashing during build
    firebaseConfig = {
      apiKey: "missing",
      authDomain: "missing",
      projectId: "missing",
      appId: "missing"
    };
  }
}

const app = initializeApp(firebaseConfig);

// Use the databaseId from the config if it's not "(default)"
export const db = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Connection Test
async function testConnection() {
  try {
    // Try reading from 'test' collection
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    console.error("Firestore connection test failed on project:", firebaseConfig.projectId);
    console.error("Error details:", error);
    
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("The client is offline. This often means the Project ID is incorrect or Firestore hasn't been created in the console.");
      console.warn("Current Project ID in config:", firebaseConfig.projectId);
    }
  }
}
testConnection();

// Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
