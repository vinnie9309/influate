import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"

const firebaseConfig = useEmulators
  ? { apiKey: "demo-key", authDomain: "localhost", projectId: "demo-influate" }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Hot reload re-runs this module; the emulators may only be connected once.
if (useEmulators && !globalThis.__influateEmulators) {
  globalThis.__influateEmulators = true
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
}
