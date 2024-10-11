"use client" // This ensures it's a client component

import useAuth from "../hooks/useAuth" // Import your custom useAuth hook

const Home = function () {
  useAuth() // Call the custom auth hook
  return (
    <div>
      <h1>Welcome to the Page</h1>
    </div>
  )
}

export default Home
