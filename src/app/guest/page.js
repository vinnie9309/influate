// src/app/guest/page.js
"use client"
import { useEffect, useState } from "react"
import RegisterForm from "@/components/Register/RegisterForm"
import LoginForm from "@/components/Login/LoginForm"

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(true)

  useEffect(() => {
    console.log("showRegister", showRegister)
  }, [showRegister])

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
