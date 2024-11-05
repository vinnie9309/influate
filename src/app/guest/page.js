"use client"
import { useState } from "react"
import RegisterForm from "@/components/Register/RegisterForm"
import LoginForm from "@/components/Login/LoginForm"

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(true)
  return (
    <>
      {showRegister ? (
        <RegisterForm setLogin={() => setShowRegister(false)} />
      ) : (
        <LoginForm setRegister={() => setShowRegister(true)} />
      )}
    </>
  )
}
