import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import {
  selectIsAuthenticated,
  loggedIn,
  loggedOut
} from "../app/api/authSlice"
const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user"))
      if (token && user) {
        dispatch(loggedIn({ user, token })) // Restore auth state if found
      } else {
        dispatch(loggedOut()) // Ensure state is logged out if no data
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/guest") // Redirect to guest page if not authenticated
    }
  }, [isAuthenticated, router])

  return isAuthenticated
}

export default useAuth
