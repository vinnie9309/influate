"use client"
import useAuth from "../hooks/useAuth"

const Home = function () {
  useAuth()
  return (
    <div>
      <h1>Welcome to the Page</h1>
    </div>
  )
}

export default Home
