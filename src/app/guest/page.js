"use client"
import { useEffect, useState } from "react"
import RegisterForm from "@/components/Register/RegisterForm"
export default function LoginForm() {
  const [typePage, setTypePage] = useState("register")
  useEffect(() => {
    console.log("typePage", typePage)
  }, [typePage])
  return (
    <>
      {typePage === "register" ? (
        <RegisterForm setLogin={setTypePage} />
      ) : (
        <LoginForm setRegister={setTypePage} />
      )}
    </>
  )
}
