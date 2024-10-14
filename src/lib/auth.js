import { auth } from "../../firebase/config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}
