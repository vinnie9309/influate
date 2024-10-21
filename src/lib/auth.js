import Cookies from "js-cookie"
import { getIdToken } from "firebase/auth"
import { auth } from "../../firebase/config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    storeAuthTokenInCookie()
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
    storeAuthTokenInCookie()
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
    removeAuthTokenFromCookie()
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const storeAuthTokenInCookie = async () => {
  const user = auth.currentUser
  if (user) {
    const token = await getIdToken(user)
    const uid = user.uid
    Cookies.set("authToken", token, {
      httpOnly: false, //only SSR
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    })
    Cookies.set("uid", uid, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    })
  }
}

export const removeAuthTokenFromCookie = () => {
  Cookies.remove("authToken")
  Cookies.remove("uid")
}
