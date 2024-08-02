"use client"
import { useState } from "react"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase/config"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password)
      console.log({ res })
      sessionStorage.setItem("user", true)
      setEmail("")
      setPassword("")
      router.push("/")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div>
        <h1>Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    </div>
  )
}

export default LoginForm
