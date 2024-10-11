"use client" // This ensures it's a client component

import useAuth from "../hooks/useAuth" // Import your custom useAuth hook

export default function Page({ children }) {
  const isAuthenticated = useAuth() // Call the custom auth hook

  if (!isAuthenticated) {
    return <div>Loading...</div> // Show loading state while checking auth
  }

  return (
    <div>
      {children} {/* Render the page content if authenticated */}
    </div>
  )
}
