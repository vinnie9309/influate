import React from "react"
import { logOut } from "../../lib/auth"
import { useDispatch } from "react-redux"
import { loggedOut } from "../../app/api/authSlice"
const Header = () => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    try {
      logOut()
      dispatch(loggedOut())
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
  return (
    <header className="header">
      <h1>Welcome to My Website</h1>
      <nav>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
