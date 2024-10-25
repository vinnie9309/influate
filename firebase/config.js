import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase, ref, set, get } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL:
    "https://shortmemory-6f0db-default-rtdb.europe-west1.firebasedatabase.app"
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getDatabase(app)

export { app, auth, db }

export const addUser = function (uid, userData) {
  const userRef = ref(db, "users/" + uid)
  return set(userRef, userData)
}

export const getUser = function (uid) {
  const userRef = ref(db, "users/" + uid)
  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val()
        console.log("User data:", userData)
        return snapshot.val()
      } else {
        console.error("No user data found")
        return null
      }
    })
    .catch((error) => {
      console.error("Error getting user:", error)
      return null
    })
}
