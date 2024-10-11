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
        dispatch(loggedIn({ user, token }))
      } else {
        dispatch(loggedOut())
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/guest")
    }
  }, [isAuthenticated, router])

  return isAuthenticated
}

export default useAuth
