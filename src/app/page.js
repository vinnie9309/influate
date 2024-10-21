"use client"
import { useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import Header from "../components/Header/Header"

const Home = function () {
  const router = useRouter()
  const isAuthenticated = useAuth()
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/guest")
    } else {
      router.push("/")
    }
  }, [isAuthenticated, router])
  return isAuthenticated ? (
    <>
      <Header />
    </>
  ) : null
}

export default Home
