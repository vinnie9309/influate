"use client"
import { useState } from "react"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase/config"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth)

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password)
      console.log({ res })
      sessionStorage.setItem("user", true)
      setEmail("")
      setPassword("")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div>
        <h1>Sign Up</h1>
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
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  )
}

export default SignUp
